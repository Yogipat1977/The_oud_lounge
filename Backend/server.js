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
      const session = event.data.object;
      console.log(`🔔 Checkout session completed for session ID: ${session.id}, Payment Status: ${session.payment_status}`);
      console.log('[Webhook] Raw session.shipping_details:', JSON.stringify(session.shipping_details, null, 2));

      const existingOrder = await Order.findOne({ stripeCheckoutSessionId: session.id });
      if (existingOrder) {
        console.log(`Order ${existingOrder._id} already processed for session ${session.id}. Sending 200 OK.`);
        return response.status(200).json({received: true, message: 'Order already processed'});
      }

      let sessionWithLineItems;
      try {
        sessionWithLineItems = await stripe.checkout.sessions.retrieve(
          session.id,
          { expand: ['line_items.data.price.product', 'customer', 'payment_intent'] }
        );
      } catch (stripeError) {
        console.error(`[Webhook] Error retrieving session ${session.id} from Stripe:`, stripeError);
        return response.status(500).json({ error: 'Failed to retrieve session details from Stripe.' });
      }
      
      const metadata = sessionWithLineItems.metadata || {}; 
      console.log('[Webhook] Session Metadata:', metadata);

      const dealWasActuallyApplied = metadata.dealApplied === 'true';
      const dealPriceWhenApplied = parseFloat(metadata.dealPriceIfApplied); 
      const cartDetailsFromMeta = JSON.parse(metadata.cartDetails || '[]');
      const originalSubtotalFromMeta = parseFloat(metadata.originalSubtotalCalculated);
      const deliveryChargePaidFromMeta = parseFloat(metadata.deliveryChargePaid);
      const totalQuantityFromMeta = parseInt(metadata.totalQuantityInCart || '0');

      const customerEmail = session.customer_details ? session.customer_details.email : 
                            (session.customer ? session.customer.email : 
                            (session.payment_intent && session.payment_intent.receipt_email ? session.payment_intent.receipt_email : null));


      const orderItemsForDB = cartDetailsFromMeta.map(item => ({
        name: item.name,
        quantity: item.quantity,
        price: item.pricePerUnit, 
        image: item.image, // Relative path stored from metadata
        product: item.dbProductId, 
      }));

      if (dealWasActuallyApplied && totalQuantityFromMeta >= 3) { 
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
        if (calculatedDiscount < 0) calculatedDiscount = 0;
      }

      const newOrderData = {
        guestEmail: customerEmail,
        orderItems: orderItemsForDB,
        
        subtotalBeforeDiscount: !isNaN(originalSubtotalFromMeta) ? originalSubtotalFromMeta : 0,
        discountAmount: calculatedDiscount,
        dealApplied: dealWasActuallyApplied,

        shippingPrice: !isNaN(deliveryChargePaidFromMeta) ? deliveryChargePaidFromMeta : 0,
        totalPrice: session.amount_total / 100,
        taxPrice: (session.total_details && session.total_details.amount_tax) ? session.total_details.amount_tax / 100 : 0,
        
        shippingAddress: session.shipping_details && session.shipping_details.address ? {
          address: session.shipping_details.address.line1,
          city: session.shipping_details.address.city,
          postalCode: session.shipping_details.address.postal_code,
          country: session.shipping_details.address.country,
        } : undefined,
        isPaid: session.payment_status === 'paid',
        paidAt: session.payment_status === 'paid' ? new Date() : null,
        orderStatus: session.payment_status === 'paid' ? 'Paid' : 'Pending',
        paymentResult: {
          id: typeof session.payment_intent === 'string' ? session.payment_intent : (session.payment_intent?.id || session.id),
          status: session.payment_status,
          update_time: new Date(session.created * 1000).toISOString(),
          email_address: customerEmail,
        },
        stripeCheckoutSessionId: session.id,
      };
      console.log('[Webhook] newOrderData.shippingAddress:', JSON.stringify(newOrderData.shippingAddress, null, 2));

      try {
        const newOrder = await Order.create(newOrderData);
        console.log(`Order ${newOrder._id} created successfully for session ${session.id}`);
        console.log('[Webhook] newOrder.shippingAddress (from DB object):', JSON.stringify(newOrder.shippingAddress, null, 2));

        if (process.env.ADMIN_PHONE_NUMBER) {
          try {
            let customerIdentifier = newOrder.guestEmail || (newOrder.paymentResult ? newOrder.paymentResult.email_address : 'N/A');
            let shippingAddressString = "No shipping address.";
            if (newOrder.shippingAddress) {
                const sa = newOrder.shippingAddress;
                const addressParts = [sa.address, sa.city, sa.postalCode, sa.country].filter(Boolean);
                if (addressParts.length > 0) shippingAddressString = addressParts.join(', ');
            }
            let productNamesString = "";
            const maxProductNameLengthPerItem = 20;
            const maxTotalProductChars = 60;
            if (newOrder.orderItems && newOrder.orderItems.length > 0) {
                const productNames = newOrder.orderItems
                    .filter(item => item.price > 0) 
                    .map(item => {
                        let name = item.name;
                        if (name.length > maxProductNameLengthPerItem) name = name.substring(0, maxProductNameLengthPerItem - 3) + "...";
                        return name;
                    });
                let tempProductString = productNames.join('; ');
                if (tempProductString.length > maxTotalProductChars) {
                    productNamesString = "";
                    for (const name of productNames) {
                        if ((productNamesString.length + name.length + 2) <= maxTotalProductChars) {
                            productNamesString += (productNamesString ? '; ' : '') + name;
                        } else {
                            productNamesString += (productNamesString ? '; ' : '') + "...";
                            break;
                        }
                    }
                } else {
                    productNamesString = tempProductString;
                }
            }
            if (!productNamesString) productNamesString = "Items in email";
            const smsBody = `TOL Order (#${newOrder._id.toString().slice(-6)}) £${newOrder.totalPrice.toFixed(2)}. ` +
                            `Cust: ${customerIdentifier}. ` +
                            `Items: ${productNamesString}. ` +
                            `Ship to: ${shippingAddressString}`;
            console.log(`[Webhook] Constructed SMS Body (length ${smsBody.length}): ${smsBody}`);
            await sendSms(process.env.ADMIN_PHONE_NUMBER, smsBody);
          } catch (smsError) {
            console.error(`[Webhook] Failed to send admin SMS for order ${newOrder._id}. Error: ${smsError.message}`);
          }
        } else {
          console.log('[Webhook] ADMIN_PHONE_NUMBER not set, skipping admin SMS notification.');
        }

        if (cartDetailsFromMeta.length > 0) {
            for (const item of cartDetailsFromMeta) { 
              if (item.dbProductId && item.quantity > 0) {
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
            console.warn(`[Webhook] No cartDetails found in metadata for stock update for session ${session.id}.`);
        }
        
        console.log(`[Webhook] Order processing complete for ${session.id}. Sending 200 OK.`);
        return response.status(200).json({ received: true, message: 'Order processed successfully' });

      } catch (dbError) {
        console.error(`[Webhook] Error saving order or updating stock for session ${session.id}:`, dbError);
        return response.status(500).json({ error: 'Failed to save order or update stock after payment.' });
      }

    default:
      console.log(`[Webhook] Unhandled event type ${event.type}. Sending 200 OK.`);
      return response.status(200).json({received: true, message: 'Unhandled event type, acknowledged.'});
  }
});

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

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
    const dbCartItems = []; // Will store items with DB-verified details

    for (const cartItem of cartItems) {
      if (!cartItem.id) { 
        console.error('[Checkout Session] Cart item missing ID:', cartItem);
        throw new Error('Invalid cart item: product ID is missing.');
      }
      const product = await Product.findOne({ id_from_js: cartItem.id });
      if (!product) {
        console.error(`[Checkout Session] Product with id_from_js ${cartItem.id} (name: "${cartItem.name}") not found in database.`);
        throw new Error(`Product "${cartItem.name || cartItem.id}" not found. Refresh cart or contact support.`);
      }
      
      dbCartItems.push({
        id_from_js: cartItem.id,
        quantity: cartItem.quantity,
        dbPrice: product.price,
        dbName: product.name,
        dbDescription: product.description,
        dbImage: product.image, // Relative path from DB
        dbProductId: product._id.toString(),
      });
      backendSubtotal += product.price * cartItem.quantity;
      backendTotalQuantity += cartItem.quantity;
    }
    console.log(`[Checkout Session] Backend calculated subtotal: £${backendSubtotal.toFixed(2)}, Total quantity: ${backendTotalQuantity}`);

    const dealMinItems = 3;
    const actualDealPrice = 100; 
    const isDealEffectivelyApplied = dealApplied && backendTotalQuantity >= dealMinItems;
    console.log(`[Checkout Session] Deal effectively applied by backend: ${isDealEffectivelyApplied}`);

    let finalCalculatedDeliveryCharge = 0;
    const deliveryThreshold = 100;
    const standardDeliveryCost = 4.99;
    let itemsValueForDeliveryCalc = backendSubtotal;

    if (isDealEffectivelyApplied) {
      itemsValueForDeliveryCalc = actualDealPrice;
    }
    if (itemsValueForDeliveryCalc < deliveryThreshold && itemsValueForDeliveryCalc > 0) {
      finalCalculatedDeliveryCharge = standardDeliveryCost;
    }
    console.log(`[Checkout Session] Final backend calculated delivery charge: £${finalCalculatedDeliveryCharge.toFixed(2)}`);

    const line_items_for_stripe = [];
    let dealItemNamesForDescription = ""; // To list product names in the deal description

    if (isDealEffectivelyApplied) {
      // Get names of products in the deal for the description
      // And determine the primary image for the bundle (e.g., first product's image)
      let primaryImageUrlForDeal = null;
      const productNamesInDeal = [];

      // Iterate through dbCartItems to get names and find the first image
      // We only need to list products up to the deal quantity, or all if more are in cart but part of the same flat price deal.
      // For simplicity here, we'll list all names from dbCartItems if they contribute to the deal.
      for (let i = 0; i < dbCartItems.length; i++) {
          const item = dbCartItems[i];
          productNamesInDeal.push(item.dbName); // Add name to list
          if (i === 0 && item.dbImage) { // Use first item's image as primary for the bundle
            primaryImageUrlForDeal = item.dbImage.startsWith('http') ? item.dbImage : `${IMAGE_BASE_URL}${item.dbImage.startsWith('/') ? item.dbImage : '/' + item.dbImage}`;
          }
      }
      dealItemNamesForDescription = productNamesInDeal.join(', ');
      if (dealItemNamesForDescription.length > 200) { // Truncate if too long for Stripe description
          dealItemNamesForDescription = dealItemNamesForDescription.substring(0, 197) + "...";
      }
      
      console.log(`[Checkout Session] Primary image for deal: ${primaryImageUrlForDeal}`);
      console.log(`[Checkout Session] Deal item names for description: ${dealItemNamesForDescription}`);

      line_items_for_stripe.push({
        price_data: {
          currency: 'gbp',
          product_data: {
            name: `Special Offer (${backendTotalQuantity} Perfumes) + 2 Free Roll-ins`,
            description: `Includes: ${dealItemNamesForDescription}. Total for selected perfumes at £${actualDealPrice.toFixed(2)}. Plus 2 Free Roll-ins (Worth £20).`,
            images: primaryImageUrlForDeal ? [primaryImageUrlForDeal] : [], // Use the first product's image
          },
          unit_amount: Math.round(actualDealPrice * 100),
        },
        quantity: 1, // The deal is one line item
      });
    } else { // No deal, or not eligible - list items individually
      for (const item of dbCartItems) {
        let imageUrl = null;
        if (item.dbImage) {
          imageUrl = item.dbImage.startsWith('http') ? item.dbImage : `${IMAGE_BASE_URL}${item.dbImage.startsWith('/') ? item.dbImage : '/' + item.dbImage}`;
        }
        console.log(`[Checkout Session] Product: ${item.dbName}, Image URL: ${imageUrl}`);
        line_items_for_stripe.push({
          price_data: {
            currency: 'gbp',
            product_data: {
              name: item.dbName,
              images: imageUrl ? [imageUrl] : [],
              description: item.dbDescription || 'No description available.',
              metadata: { dbProductId: item.dbProductId }
            },
            unit_amount: Math.round(item.dbPrice * 100),
          },
          quantity: item.quantity,
        });
      }
    }

    if (finalCalculatedDeliveryCharge > 0) {
      line_items_for_stripe.push({
        price_data: {
          currency: 'gbp',
          product_data: { name: 'Delivery Charge' }, // No image needed for delivery
          unit_amount: Math.round(finalCalculatedDeliveryCharge * 100),
        },
        quantity: 1,
      });
    }

    const metadataForStripe = {
      cartDetails: JSON.stringify(dbCartItems.map(item => ({ 
        id_from_js: item.id_from_js,
        dbProductId: item.dbProductId,
        name: item.dbName,
        quantity: item.quantity,
        pricePerUnit: item.dbPrice,
        image: item.dbImage // Store relative path in metadata for order creation
      }))),
      dealApplied: isDealEffectivelyApplied ? 'true' : 'false',
      dealPriceIfApplied: isDealEffectivelyApplied ? actualDealPrice.toFixed(2) : null,
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
      success_url: `${FRONTEND_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout-cancel`,
      metadata: metadataForStripe,
    };
    
    console.log('[Checkout Session] Attempting to create Stripe session with params (first 1000 chars):', JSON.stringify(sessionParams, null, 2).substring(0,1000) + "...");
    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);
    console.log('[Checkout Session] Stripe session created successfully. ID:', checkoutSession.id);
    return res.status(200).json({ sessionId: checkoutSession.id });

  } catch (error) {
    console.error('[Checkout Session] Overall error:', error.message, error.stack);
    if (!res.headersSent) {
      if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
      }
      return res.status(500).json({ error: 'Failed to create checkout session. ' + error.message });
    } else {
      console.error('[Checkout Session] Headers already sent, cannot send error JSON response.');
    }
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node server listening on port ${PORT}`);
});