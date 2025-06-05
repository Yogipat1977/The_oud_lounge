// backend/server.js
require('dotenv').config();
const express = require('express');
const StripeNode = require('stripe');
const cors = require('cors');
const connectDB = require('./Config/db');
const Order = require('./Models/Order');
const Product = require('./Models/Product');
const User = require('./Models/User'); // Keep for potential future use or admin SMS
const sendSms = require('./Utils/smsSender');

// Import Routes
const authRoutes = require('./Routes/authRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const productRoutes = require('./Routes/productRoutes');

// Initialize DB Connection
connectDB();

const stripe = StripeNode(process.env.STRIPE_SECRET_KEY);
const app = express();

const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
// Prioritize IMAGE_BASE_URL from .env, then FRONTEND_URL.
// This ensures Stripe gets absolute URLs if images are served from the frontend.
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL || process.env.FRONTEND_URL;


const corsOptions = {
  origin: FRONTEND_URL,
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Stripe webhook (keep this before express.json() for raw body parsing)
app.post('/api/webhook', express.raw({type: 'application/json'}), async (request, response) => {
  const sig = request.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, webhookSecret);
  } catch (err) {
    console.log(`⚠️  Webhook signature verification failed. Message: ${err.message}`);
    return response.status(400).send(`Webhook Error: ${err.message}`);
  }

  console.log(`[Webhook] Received event: ${event.id}, type: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object; // This is the session object directly from the webhook event
      console.log(`🔔 Checkout session completed for session ID: ${session.id}, Payment Status: ${session.payment_status}`);
      console.log('[Webhook] Raw session.shipping_details (from webhook payload):', JSON.stringify(session.shipping_details, null, 2));

      const existingOrder = await Order.findOne({ stripeCheckoutSessionId: session.id });
      if (existingOrder) {
        console.log(`Order ${existingOrder._id} already processed for session ${session.id}. Sending 200 OK.`);
        return response.status(200).json({received: true, message: 'Order already processed'});
      }

      // Retrieve the session again from Stripe API for potentially more complete data
      // and to expand necessary fields like line_items.
      let retrievedSessionWithDetails;
      try {
        retrievedSessionWithDetails = await stripe.checkout.sessions.retrieve(
          session.id, // Use the session ID from the webhook event
          { expand: ['line_items.data.price.product', 'customer', 'payment_intent'] }
        );
        console.log('[Webhook] Retrieved sessionWithDetails.shipping_details (from API retrieve):', JSON.stringify(retrievedSessionWithDetails.shipping_details, null, 2));
      } catch (stripeError) {
        console.error(`[Webhook] Error retrieving session ${session.id} from Stripe API:`, stripeError);
        return response.status(500).json({ error: 'Failed to retrieve full session details from Stripe.' });
      }
      
      const metadata = retrievedSessionWithDetails.metadata || {}; 
      console.log('[Webhook] Session Metadata (from retrieved session):', metadata);

      const dealWasActuallyApplied = metadata.dealApplied === 'true';
      const dealPriceWhenApplied = parseFloat(metadata.dealPriceIfApplied); 
      const cartDetailsFromMeta = JSON.parse(metadata.cartDetails || '[]');
      const originalSubtotalFromMeta = parseFloat(metadata.originalSubtotalCalculated);
      const deliveryChargePaidFromMeta = parseFloat(metadata.deliveryChargePaid);
      const totalQuantityFromMeta = parseInt(metadata.totalQuantityInCart || '0');

      // Prioritize customer email from retrieved session, then webhook payload
      const customerEmail = retrievedSessionWithDetails.customer_details?.email ||
                            session.customer_details?.email || 
                            retrievedSessionWithDetails.customer?.email ||
                            session.customer?.email ||
                            retrievedSessionWithDetails.payment_intent?.receipt_email ||
                            session.payment_intent?.receipt_email ||
                            null;

      const orderItemsForDB = cartDetailsFromMeta.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.pricePerUnit, 
        image: item.image, // Relative path stored from metadata
        product: item.dbProductId, 
      }));

      // Add bonus gifts if the deal was applied
      if (dealWasActuallyApplied && totalQuantityFromMeta >= 3) { // Assuming 3 is the deal minimum
        orderItemsForDB.push({
          name: 'Free Roll-in (Bonus Gift 1)', quantity: 1, price: 0, image: '/Images/placeholder_roll_in.jpg', product: null,
        });
        orderItemsForDB.push({
          name: 'Free Roll-in (Bonus Gift 2)', quantity: 1, price: 0, image: '/Images/placeholder_roll_in.jpg', product: null,
        });
      }
      
      let calculatedDiscount = 0;
      if (dealWasActuallyApplied && !isNaN(dealPriceWhenApplied) && !isNaN(originalSubtotalFromMeta)) {
        calculatedDiscount = originalSubtotalFromMeta - dealPriceWhenApplied;
        if (calculatedDiscount < 0) calculatedDiscount = 0; // Discount cannot be negative
      }

      // Use shipping details: prioritize retrieved session, then webhook payload
      const shippingDetailsToUse = retrievedSessionWithDetails.shipping_details || session.shipping_details;

      const newOrderData = {
        guestEmail: customerEmail,
        orderItems: orderItemsForDB,
        
        subtotalBeforeDiscount: !isNaN(originalSubtotalFromMeta) ? originalSubtotalFromMeta : 0,
        discountAmount: calculatedDiscount,
        dealApplied: dealWasActuallyApplied,

        shippingPrice: !isNaN(deliveryChargePaidFromMeta) ? deliveryChargePaidFromMeta : 0,
        totalPrice: retrievedSessionWithDetails.amount_total / 100, // Use amount_total from retrieved session
        taxPrice: (retrievedSessionWithDetails.total_details && retrievedSessionWithDetails.total_details.amount_tax) ? retrievedSessionWithDetails.total_details.amount_tax / 100 : 0,
        
        shippingAddress: shippingDetailsToUse && shippingDetailsToUse.address ? {
          name: shippingDetailsToUse.name || null, // Capture recipient name
          address: shippingDetailsToUse.address.line1,
          city: shippingDetailsToUse.address.city,
          postalCode: shippingDetailsToUse.address.postal_code,
          country: shippingDetailsToUse.address.country,
        } : undefined,
        isPaid: retrievedSessionWithDetails.payment_status === 'paid',
        paidAt: retrievedSessionWithDetails.payment_status === 'paid' ? new Date() : null,
        orderStatus: retrievedSessionWithDetails.payment_status === 'paid' ? 'Paid' : 'Pending',
        paymentResult: {
          id: typeof retrievedSessionWithDetails.payment_intent === 'string' ? retrievedSessionWithDetails.payment_intent : (retrievedSessionWithDetails.payment_intent?.id || retrievedSessionWithDetails.id),
          status: retrievedSessionWithDetails.payment_status,
          update_time: new Date(retrievedSessionWithDetails.created * 1000).toISOString(),
          email_address: customerEmail,
        },
        stripeCheckoutSessionId: retrievedSessionWithDetails.id, // Use ID from retrieved session
      };
      console.log('[Webhook] newOrderData.shippingAddress (to be saved):', JSON.stringify(newOrderData.shippingAddress, null, 2));

      try {
        const newOrder = await Order.create(newOrderData);
        console.log(`Order ${newOrder._id} created successfully for session ${retrievedSessionWithDetails.id}`);
        console.log('[Webhook] newOrder.shippingAddress (from DB object):', JSON.stringify(newOrder.shippingAddress, null, 2));

        // --- DETAILED SMS CONSTRUCTION ---
        if (process.env.ADMIN_PHONE_NUMBER) {
          try {
            const smsCustomerEmail = newOrder.guestEmail || (newOrder.paymentResult?.email_address) || 'N/A';

            let itemsSummary = "";
            if (newOrder.orderItems && newOrder.orderItems.length > 0) {
              itemsSummary = newOrder.orderItems
                .map(item => `${item.quantity}x ${item.name}`)
                .join(', ');
            }
            if (!itemsSummary) itemsSummary = "Details in email";

            let shippingAddressString = "No shipping address provided.";
            if (newOrder.shippingAddress) {
              const sa = newOrder.shippingAddress;
              const namePart = sa.name ? `${sa.name}, ` : "";
              const addressParts = [sa.address, sa.city, sa.postalCode, sa.country].filter(Boolean);
              if (addressParts.length > 0) {
                shippingAddressString = namePart + addressParts.join(', ');
              } else if (namePart) {
                shippingAddressString = namePart.slice(0, -2); 
              }
            }

            const smsBody = 
`TOL Order Alert!
ID: #${newOrder._id.toString().slice(-6)}
Total: £${newOrder.totalPrice.toFixed(2)}
Cust Email: ${smsCustomerEmail}
Items: ${itemsSummary}
Ship To: ${shippingAddressString}`;
            console.log(`[Webhook] Constructed Detailed SMS Body (length ${smsBody.length}):\n${smsBody}`);
            await sendSms(process.env.ADMIN_PHONE_NUMBER, smsBody);
          } catch (smsError) {
            console.error(`[Webhook] Failed to send detailed admin SMS for order ${newOrder._id}. Error: ${smsError.message}`);
          }
        } else {
          console.log('[Webhook] ADMIN_PHONE_NUMBER not set, skipping admin SMS notification.');
        }
        // --- END DETAILED SMS CONSTRUCTION ---

        // Stock Update Logic
        if (cartDetailsFromMeta.length > 0) {
            for (const item of cartDetailsFromMeta) { 
              if (item.dbProductId && item.quantity > 0) { // Ensure dbProductId exists and quantity is positive
                try {
                  await Product.findByIdAndUpdate(item.dbProductId, {
                    $inc: { stockQuantity: -item.quantity },
                  });
                  console.log(`[Webhook] Stock updated for product ${item.name} (DB ID: ${item.dbProductId}), removed: ${item.quantity}`);
                } catch (stockUpdateError) {
                  console.error(`[Webhook] Error updating stock for product ${item.dbProductId}:`, stockUpdateError);
                }
              }
            }
        } else {
            console.warn(`[Webhook] No cartDetails found in metadata for stock update for session ${retrievedSessionWithDetails.id}.`);
        }
        
        console.log(`[Webhook] Order processing complete for ${retrievedSessionWithDetails.id}. Sending 200 OK.`);
        return response.status(200).json({ received: true, message: 'Order processed successfully' });

      } catch (dbError) {
        console.error(`[Webhook] Error saving order or updating stock for session ${retrievedSessionWithDetails.id}:`, dbError);
        // Consider the type of error. If it's a duplicate key error for stripeCheckoutSessionId,
        // it might mean the order was already processed by a concurrent webhook.
        if (dbError.code === 11000 && dbError.keyPattern && dbError.keyPattern.stripeCheckoutSessionId) {
             console.log(`[Webhook] Race condition likely: Order for session ${retrievedSessionWithDetails.id} already created (duplicate key error).`);
             return response.status(200).json({ received: true, message: 'Order already processed (detected duplicate key on create)' });
        }
        return response.status(500).json({ error: 'Failed to save order or update stock after payment.' });
      }

    default:
      // Acknowledge other event types to prevent Stripe from resending them.
      console.log(`[Webhook] Unhandled event type ${event.type}. Sending 200 OK.`);
      return response.status(200).json({received: true, message: 'Unhandled event type, acknowledged.'});
  }
});

// Middleware for parsing JSON bodies (should be after webhook for raw body)
app.use(express.json());

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Create Checkout Session Endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  const { cartItems, dealApplied } = req.body; 
  console.log('[Checkout Session] Request received. CartItems count:', cartItems ? cartItems.length : 0, 'Deal Applied from Frontend:', dealApplied);

  if (!cartItems || cartItems.length === 0) {
    console.log('[Checkout Session] Cart is empty. Sending 400.');
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    let backendSubtotal = 0;
    let backendTotalQuantity = 0;
    const dbCartItems = []; // Will store items with DB-verified details for metadata

    // Fetch all product details from DB at once for efficiency if many products
    // This is an optimization if cartItems contains many items.
    // For a few items, individual queries are fine.
    const productIdsFromJs = cartItems.map(item => item.id);
    const productsFromDB = await Product.find({ id_from_js: { $in: productIdsFromJs } });
    const productsMap = new Map(productsFromDB.map(p => [p.id_from_js, p]));


    for (const cartItem of cartItems) {
      if (typeof cartItem.id === 'undefined') { // Check for undefined specifically
        console.error('[Checkout Session] Cart item missing ID:', cartItem);
        throw new Error('Invalid cart item: product ID is missing.');
      }
      const product = productsMap.get(cartItem.id); // Use the map for quick lookup

      if (!product) {
        console.error(`[Checkout Session] Product with id_from_js ${cartItem.id} (name: "${cartItem.name}") not found in database.`);
        throw new Error(`Product "${cartItem.name || cartItem.id}" not found. Refresh cart or contact support.`);
      }
      
      dbCartItems.push({
        id_from_js: cartItem.id, // Keep original ID from JS
        quantity: cartItem.quantity,
        dbPrice: product.price,     // Price from DB
        dbName: product.name,       // Name from DB
        dbDescription: product.description, // Description from DB
        dbImage: product.image,     // Relative image path from DB
        dbProductId: product._id.toString(), // MongoDB ObjectId as string
      });
      backendSubtotal += product.price * cartItem.quantity;
      backendTotalQuantity += cartItem.quantity;
    }
    console.log(`[Checkout Session] Backend calculated subtotal: £${backendSubtotal.toFixed(2)}, Total quantity: ${backendTotalQuantity}`);

    const dealMinItems = 3; // Minimum items for the deal
    const actualDealPrice = 100; // The fixed price for the deal
    const isDealEffectivelyApplied = dealApplied && backendTotalQuantity >= dealMinItems;
    console.log(`[Checkout Session] Deal effectively applied by backend: ${isDealEffectivelyApplied}`);

    // Calculate delivery charge
    let finalCalculatedDeliveryCharge = 0;
    const deliveryThreshold = 100; // Free delivery if itemsValue is 100 or more
    const standardDeliveryCost = 4.99;
    let itemsValueForDeliveryCalc = backendSubtotal;

    if (isDealEffectivelyApplied) {
      itemsValueForDeliveryCalc = actualDealPrice; // If deal applied, use deal price for delivery calc
    }
    if (itemsValueForDeliveryCalc < deliveryThreshold && itemsValueForDeliveryCalc > 0) {
      finalCalculatedDeliveryCharge = standardDeliveryCost;
    }
    console.log(`[Checkout Session] Final backend calculated delivery charge: £${finalCalculatedDeliveryCharge.toFixed(2)}`);

    const line_items_for_stripe = [];
    
    if (isDealEffectivelyApplied) {
      let primaryImageUrlForDeal = null;
      const productNamesInDeal = dbCartItems.map(item => item.dbName); // All items contribute to the bundle name
      
      if (dbCartItems.length > 0 && dbCartItems[0].dbImage) {
          const firstItemImage = dbCartItems[0].dbImage;
          primaryImageUrlForDeal = firstItemImage.startsWith('http') ? firstItemImage : `${IMAGE_BASE_URL}${firstItemImage.startsWith('/') ? firstItemImage : '/' + firstItemImage}`;
      }

      let dealDescription = `Includes: ${productNamesInDeal.join(', ')}. Total for selected perfumes at £${actualDealPrice.toFixed(2)}. Plus 2 Free Roll-ins (Worth £20).`;
      if (dealDescription.length > 1000) { // Stripe's description limit is generous but good to check
          dealDescription = dealDescription.substring(0, 997) + "...";
      }
      
      line_items_for_stripe.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Special Offer (${backendTotalQuantity} Perfumes) + 2 Free Roll-ins`,
            description: dealDescription,
            images: primaryImageUrlForDeal ? [primaryImageUrlForDeal] : [],
            // No metadata.dbProductId here as this is a bundle, not a single DB product
          },
          unit_amount: Math.round(actualDealPrice * 100),
        },
        quantity: 1, // The deal is one line item in Stripe
      });
    } else { // No deal, or not eligible - list items individually
      for (const item of dbCartItems) {
        let imageUrl = null;
        if (item.dbImage) {
          imageUrl = item.dbImage.startsWith('http') ? item.dbImage : `${IMAGE_BASE_URL}${item.dbImage.startsWith('/') ? item.dbImage : '/' + item.dbImage}`;
        }
        console.log(`[Checkout Session] Adding to Stripe Line Items (No Deal): Product: ${item.dbName}, Image URL: ${imageUrl}, DB ID: ${item.dbProductId}`);
        line_items_for_stripe.push({
          price_data: {
            currency: 'gbp',
            product_data: {
              name: item.dbName,
              images: imageUrl ? [imageUrl] : [],
              description: item.dbDescription || 'No description available.',
              metadata: { dbProductId: item.dbProductId } // Crucial for stock update if not a deal
            },
            unit_amount: Math.round(item.dbPrice * 100),
          },
          quantity: item.quantity,
        });
      }
    }

    // Add delivery charge as a line item if applicable
    if (finalCalculatedDeliveryCharge > 0) {
      line_items_for_stripe.push({
        price_data: {
          currency: 'gbp',
          product_data: { name: 'Delivery Charge' },
          unit_amount: Math.round(finalCalculatedDeliveryCharge * 100),
        },
        quantity: 1,
      });
    }

    // Prepare metadata to be stored with the Stripe session
    const metadataForStripe = {
      cartDetails: JSON.stringify(dbCartItems.map(item => ({ 
        // Storing essential details needed by webhook to recreate orderItemsForDB
        id_from_js: item.id_from_js,
        dbProductId: item.dbProductId,
        name: item.dbName,
        quantity: item.quantity,
        pricePerUnit: item.dbPrice, // Store the original price per unit
        image: item.dbImage // Store relative image path for consistency
      }))),
      dealApplied: isDealEffectivelyApplied ? 'true' : 'false',
      dealPriceIfApplied: isDealEffectivelyApplied ? actualDealPrice.toFixed(2) : "", // Store as string or empty
      originalSubtotalCalculated: backendSubtotal.toFixed(2),
      deliveryChargePaid: finalCalculatedDeliveryCharge.toFixed(2),
      totalQuantityInCart: backendTotalQuantity.toString(),
    };

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: line_items_for_stripe,
      mode: 'payment',
      shipping_address_collection: { allowed_countries: ['GB', 'US', 'CA', 'AU'] },
      invoice_creation: { enabled: true },
      customer_creation: 'if_required', 
      success_url: `${FRONTEND_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`, // Make sure this is correct
      cancel_url: `${FRONTEND_URL}/checkout-cancel`, // Make sure this is correct
      metadata: metadataForStripe,
    };
    
    // Log only a portion of sessionParams if it's too large for console
    const sessionParamsString = JSON.stringify(sessionParams, null, 2);
    console.log('[Checkout Session] Attempting to create Stripe session with params (first 1000 chars):', sessionParamsString.substring(0,1000) + (sessionParamsString.length > 1000 ? "..." : ""));
    
    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);
    console.log('[Checkout Session] Stripe session created successfully. ID:', checkoutSession.id);
    return res.status(200).json({ sessionId: checkoutSession.id });

  } catch (error) {
    console.error('[Checkout Session] Overall error:', error.message, error.stack);
    if (!res.headersSent) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Failed to create checkout session due to an internal error. Details: ' + error.message });
    } else {
      console.error('[Checkout Session] Headers already sent, cannot send error JSON response.');
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node server listening on port ${PORT}`);
});