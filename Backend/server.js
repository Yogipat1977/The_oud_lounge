// backend/server.js
require('dotenv').config();
const express = require('express');
const StripeNode = require('stripe');
const cors = require('cors');
const connectDB = require('./Config/db');
const Order = require('./Models/Order');
const Product = require('./Models/Product');
const User = require('./Models/User'); // Assuming you might use User for email prefill
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
const IMAGE_BASE_URL = process.env.FRONTEND_URL; // Make sure FRONTEND_URL is https://www.theoudlounge.co.uk or https://theoudlounge.co.uk

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
    return response.status(400).send(`Webhook Error: ${err.message}`); // Sending plain text for this specific error is fine
  }

  console.log(`[Webhook] Received event: ${event.id}, type: ${event.type}`);

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`🔔 Checkout session completed for session ID: ${session.id}, Payment Status: ${session.payment_status}`);

      const existingOrder = await Order.findOne({ stripeCheckoutSessionId: session.id });
      if (existingOrder) {
        console.log(`Order ${existingOrder._id} already processed for session ${session.id}. Sending 200 OK.`);
        return response.status(200).json({received: true, message: 'Order already processed'});
      }

      let sessionWithLineItems;
      try {
        sessionWithLineItems = await stripe.checkout.sessions.retrieve(
          session.id,
          { expand: ['line_items.data.price.product', 'customer', 'payment_intent'] } // Expand customer and payment_intent
        );
      } catch (stripeError) {
        console.error(`[Webhook] Error retrieving session ${session.id} from Stripe:`, stripeError);
        return response.status(500).json({ error: 'Failed to retrieve session details from Stripe.' });
      }
      

      if (sessionWithLineItems.line_items && sessionWithLineItems.line_items.data.length > 0) {
        sessionWithLineItems.line_items.data.forEach((item, index) => {
          if (item.price && item.price.product && item.price.product.metadata) {
            console.log(`[Webhook] Line Item ${index} Name: ${item.price.product.name}, Price Product Metadata:`, item.price.product.metadata);
          } else {
            console.warn(`[Webhook] Line Item ${index} has incomplete price/product/metadata structure.`);
          }
        });
      } else {
        console.log('[Webhook] No line items found in sessionWithLineItems.');
      }
      
      const orderItems = sessionWithLineItems.line_items.data.map(item => ({
        name: item.price.product.name,
        quantity: item.quantity,
        price: item.price.unit_amount / 100,
        image: item.price.product.images && item.price.product.images.length > 0 ? item.price.product.images[0] : null,
        // Ensure metadata and dbProductId exist before trying to access
        productId: (item.price.product.metadata && item.price.product.metadata.dbProductId) ? item.price.product.metadata.dbProductId : null,
      }));

      const userId = session.metadata.userId || null;
      // Prefer email from Stripe's customer object if available, then payment_intent, then customer_details
      const customerEmail = session.customer ? session.customer.email : 
                            (session.payment_intent && session.payment_intent.receipt_email ? session.payment_intent.receipt_email :
                            (session.customer_details ? session.customer_details.email : null));

      const guestEmail = userId ? null : customerEmail;


      try {
        const newOrder = await Order.create({
          user: userId || undefined, // Mongoose handles null appropriately for ObjectId if not required
          guestEmail: guestEmail,
          orderItems: orderItems,
          totalPrice: session.amount_total / 100,
          taxPrice: (session.total_details && session.total_details.amount_tax) ? session.total_details.amount_tax / 100 : 0,
          shippingPrice: (session.total_details && session.total_details.amount_shipping) ? session.total_details.amount_shipping / 100 : 0,
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
            id: typeof session.payment_intent === 'string' ? session.payment_intent : session.payment_intent?.id,
            status: session.payment_status,
            update_time: new Date(session.created * 1000).toISOString(),
            email_address: customerEmail,
          },
          stripeCheckoutSessionId: session.id,
        });
        console.log(`Order ${newOrder._id} created successfully for session ${session.id}`);

   // --- START: Admin SMS Notification with Product Names & Shipping Address ---
        if (process.env.ADMIN_PHONE_NUMBER) {
          try {
            let customerIdentifier = newOrder.guestEmail;
            if (newOrder.user) {
                try {
                    const orderUser = await User.findById(newOrder.user);
                    if (orderUser) customerIdentifier = orderUser.name || orderUser.email;
                } catch (userFetchError) {
                    console.warn(`Could not fetch user details for SMS for order ${newOrder._id}`);
                    customerIdentifier = newOrder.guestEmail || (newOrder.paymentResult ? newOrder.paymentResult.email_address : 'N/A');
                }
            }

            let shippingAddressString = "No shipping address."; // Shortened default
            if (newOrder.shippingAddress) {
                const sa = newOrder.shippingAddress;
                const addressParts = [sa.address, sa.city, sa.postalCode, sa.country].filter(Boolean);
                if (addressParts.length > 0) {
                    shippingAddressString = addressParts.join(', ');
                }
            }

            // --- Product Names for SMS ---
            let productNamesString = "";
            const maxProductNameLengthPerItem = 20; // Max chars per product name in SMS
            const maxTotalProductChars = 60; // Max total chars for all product names
            let currentProductChars = 0;

            if (newOrder.orderItems && newOrder.orderItems.length > 0) {
                const productNames = newOrder.orderItems.map(item => {
                    let name = item.name;
                    if (name.length > maxProductNameLengthPerItem) {
                        name = name.substring(0, maxProductNameLengthPerItem - 3) + "..."; // Truncate
                    }
                    return name;
                });

                let tempProductString = productNames.join('; ');
                if (tempProductString.length > maxTotalProductChars) {
                    // If too long, try to fit as many as possible
                    productNamesString = "";
                    for (const name of productNames) {
                        if ((productNamesString.length + name.length + 2) <= maxTotalProductChars) { // +2 for '; '
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
            if (!productNamesString) {
                productNamesString = "Items in email"; // Fallback if names are too long or no items
            }
            // --- End Product Names for SMS ---


            // Construct the SMS body
            // Example: TOL Order (#123abc) £99.99. Cust: John D. Items: Rose Oud; Velvet Musk... Ship to: 123 Main St, London, EC1A 1BB, GB
            const smsBody = `TOL Order (#${newOrder._id.toString().slice(-6)}) £${newOrder.totalPrice.toFixed(2)}. ` +
                            `Cust: ${customerIdentifier}. ` +
                            `Items: ${productNamesString}. ` +
                            `Ship to: ${shippingAddressString}`;
            
            console.log(`[Webhook] Constructed SMS Body (length ${smsBody.length}): ${smsBody}`);

            if (smsBody.length > 160) {
                console.warn(`[Webhook] Admin SMS for order ${newOrder._id} is long (${smsBody.length} chars). Consider shortening or sending less info.`);
                // Fallback to a shorter message if it's too long
                // const shortSmsBody = `TOL Order (#${newOrder._id.toString().slice(-6)}) £${newOrder.totalPrice.toFixed(2)}. Cust: ${customerIdentifier}. Details in email.`;
                // await sendSms(process.env.ADMIN_PHONE_NUMBER, shortSmsBody);
                // For now, we'll send the long one and let it segment.
            }

            await sendSms(process.env.ADMIN_PHONE_NUMBER, smsBody);
            // Success is logged in smsSender.js
          } catch (smsError) {
            // Error is logged in smsSender.js
            console.error(`[Webhook] Failed to send admin SMS (with products/address) for order ${newOrder._id}.`);
          }
        } else {
          console.log('[Webhook] ADMIN_PHONE_NUMBER not set, skipping admin SMS notification.');
        }
        // --- END: Admin SMS Notification ---


        for (const item of newOrder.orderItems) {
          if (item.productId) {
            try {
                await Product.findByIdAndUpdate(item.productId, {
                $inc: { stockQuantity: -item.quantity },
                });
                console.log(`Stock updated for product ${item.productId}`);
            } catch(stockUpdateError) {
                console.error(`Error updating stock for product ${item.productId}:`, stockUpdateError)
                // Decide if this should be a critical error for the webhook response
            }
          } else {
            console.warn(`[Webhook] Could not update stock for item "${item.name}" as dbProductId was missing from Stripe metadata.`);
          }
        }
        console.log(`[Webhook] Order processing complete for ${session.id}. Sending 200 OK.`);
        return response.status(200).json({ received: true, message: 'Order processed successfully' });


      } catch (dbError) {
        console.error(`[Webhook] Error saving order or updating stock for session ${session.id}:`, dbError);
        return response.status(500).json({ error: 'Failed to save order or update stock after payment.' });
      }
      // break; // No longer needed due to returns in each path

    default:
      console.log(`[Webhook] Unhandled event type ${event.type}. Sending 200 OK.`);
      return response.status(200).json({received: true, message: 'Unhandled event type, acknowledged.'});
  }

  // Fallback response, though all paths in checkout.session.completed should now return
  // console.log("[Webhook] Reached end of handler, sending generic 200 OK.");
  // response.status(200).json({received: true}); 
});

app.use(express.json());

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

app.post('/api/create-checkout-session', async (req, res) => {
  const { cartItems, userId } = req.body;
  console.log('[Checkout Session] Request received. UserID:', userId, 'CartItems count:', cartItems ? cartItems.length : 0);

  if (!cartItems || cartItems.length === 0) {
    console.log('[Checkout Session] Cart is empty. Sending 400.');
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    console.log('[Checkout Session] Processing line items...');
    const line_items = await Promise.all(cartItems.map(async (cartItem) => {
      if (!cartItem.id) {
          console.error('[Checkout Session] Cart item missing ID:', cartItem);
          throw new Error('Invalid cart item: product ID is missing.');
      }
      console.log(`[Checkout Session] Finding product with id_from_js: ${cartItem.id}`);
      const product = await Product.findOne({ id_from_js: cartItem.id });

      if (!product) {
        console.error(`[Checkout Session] Product with id_from_js ${cartItem.id} not found in database.`);
        throw new Error(`Product with ID ${cartItem.id} not found. Please refresh your cart.`);
      }
      console.log(`[Checkout Session] Product found: ${product.name}, DB ID: ${product._id}, Price: ${product.price}`);

      let imageUrl = null;
      if (product.image) {
        if (product.image.startsWith('http')) {
          imageUrl = product.image;
        } else {
          const imagePath = product.image.startsWith('/') ? product.image : `/${product.image}`;
          imageUrl = `${IMAGE_BASE_URL}${imagePath}`;
        }
      }
      console.log(`[Checkout Session] Image URL for ${product.name}: ${imageUrl}`);

      return {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: product.name,
            images: imageUrl ? [imageUrl] : [],
            description: product.description || 'No description available.', // Add fallback
            metadata: {
                dbProductId: product._id.toString()
            }
          },
          unit_amount: Math.round(product.price * 100), // Ensure price is a number
        },
        quantity: cartItem.quantity,
      };
    }));
    console.log('[Checkout Session] Line items processed successfully.');

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'AU'],
      },
      invoice_creation: { enabled: true },
      customer_creation: 'if_required',
      success_url: `${FRONTEND_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${FRONTEND_URL}/checkout-cancel`, // Fixed typo: removed extra '$'
      metadata: {},
    };

    if (userId) {
      sessionParams.metadata.userId = userId;
      try {
        const user = await User.findById(userId);
        if (user && user.email) {
          sessionParams.customer_email = user.email; // Pre-fill email for logged-in users
          console.log(`[Checkout Session] Pre-filling email for user ${userId}: ${user.email}`);
        }
      } catch (err) {
        console.warn(`[Checkout Session] Could not fetch user email for Stripe session for user ${userId}:`, err.message);
      }
    }
    console.log('[Checkout Session] Attempting to create Stripe session with params:', JSON.stringify(sessionParams, null, 2));
    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);
    console.log('[Checkout Session] Stripe session created successfully. ID:', checkoutSession.id);
    return res.status(200).json({ sessionId: checkoutSession.id }); // Explicitly set 200 status

  } catch (error) {
    console.error('[Checkout Session] Overall error:', error.message, error.stack); // Log full stack
    if (!res.headersSent) { // Check if headers already sent
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