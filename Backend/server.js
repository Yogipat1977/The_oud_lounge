// backend/server.js
require('dotenv').config();
const express = require('express');
const StripeNode = require('stripe');
const cors =require('cors');
const connectDB = require('./Config/db'); // Import DB connection
const Order = require('./Models/Order');   // Import Order model
const Product = require('./Models/Product'); // <<<<<< 1. IMPORT PRODUCT MODEL (ensure path is correct)

// Import Routes
const authRoutes = require('./Routes/authRoutes');
const orderRoutes = require('./Routes/orderRoutes');
const productRoutes = require('./Routes/productRoutes');

// Initialize DB Connection
connectDB();

const stripe = StripeNode(process.env.STRIPE_SECRET_KEY);
const app = express();

// YOUR_DOMAIN should be your base frontend URL. Paths like /The_oud_lounge are part of the success/cancel URLs.
const YOUR_DOMAIN = process.env.FRONTEND_URL || 'http://localhost:5173';
// Define a base URL for images, especially if served from backend or a specific CDN/storage
const IMAGE_BASE_URL = process.env.IMAGE_BASE_URL || process.env.BACKEND_URL || 'http://localhost:5000'; // Example: your backend URL
// In server.js
const corsOptions = {
  origin: process.env.FRONTEND_URL || 'http://localhost:5173', // Only allow your frontend
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
    console.log(`⚠️  Webhook signature verification failed.`, err.message);
    return response.sendStatus(400);
  }

  switch (event.type) {
    case 'checkout.session.completed':
      const session = event.data.object;
      console.log(`🔔 Checkout session completed for session ID: ${session.id}`);

      const existingOrder = await Order.findOne({ stripeCheckoutSessionId: session.id });
      if (existingOrder) {
        console.log(`Order ${existingOrder._id} already processed for session ${session.id}`);
        return response.json({received: true, message: 'Order already processed'});
      }

      const sessionWithLineItems = await stripe.checkout.sessions.retrieve(
        session.id,
        { expand: ['line_items.data.price.product'] }
      );

            if (sessionWithLineItems.line_items && sessionWithLineItems.line_items.data.length > 0) {
        sessionWithLineItems.line_items.data.forEach((item, index) => {
          console.log(`[Webhook] Line Item ${index} Price Product Metadata:`, item.price.product.metadata);
        });
      } else {
        console.log('[Webhook] No line items found in sessionWithLineItems.');
      }
      
      const orderItems = sessionWithLineItems.line_items.data.map(item => ({
        name: item.price.product.name,
        quantity: item.quantity,
        price: item.price.unit_amount / 100,
        image: item.price.product.images && item.price.product.images.length > 0 ? item.price.product.images[0] : null,
        productId: item.price.product.metadata.dbProductId || null,
      }));

      const userId = session.metadata.userId || null;
      const guestEmail = userId ? null : session.customer_details.email;

      try {
        const newOrder = await Order.create({
          user: userId,
          guestEmail: guestEmail,
          orderItems: orderItems,
          totalPrice: session.amount_total / 100,
          taxPrice: session.total_details.amount_tax / 100, // Will be populated if Stripe calculates tax
          shippingPrice: session.total_details.amount_shipping / 100, // Will be populated if shipping options are configured
          shippingAddress: session.shipping_details ? { // This section correctly captures shipping details
            address: session.shipping_details.address.line1,
            city: session.shipping_details.address.city,
            postalCode: session.shipping_details.address.postal_code,
            country: session.shipping_details.address.country,
            // You can also add line2 and state if needed and available:
            // line2: session.shipping_details.address.line2,
            // state: session.shipping_details.address.state,
          } : undefined,
          isPaid: session.payment_status === 'paid',
          paidAt: session.payment_status === 'paid' ? new Date() : null,
          orderStatus: session.payment_status === 'paid' ? 'Paid' : 'Pending',
          paymentResult: {
            id: session.payment_intent,
            status: session.payment_status,
            update_time: new Date(session.created * 1000).toISOString(),
            email_address: session.customer_details.email,
          },
          stripeCheckoutSessionId: session.id,
        });
        console.log(`Order ${newOrder._id} created successfully for session ${session.id}`);

        for (const item of newOrder.orderItems) {
          if (item.productId) {
            await Product.findByIdAndUpdate(item.productId, {
              $inc: { stockQuantity: -item.quantity },
            });
            console.log(`Stock updated for product ${item.productId}`);
          } else {
            console.warn(`Could not update stock for item "${item.name}" as dbProductId was missing from Stripe metadata.`);
          }
        }

      } catch (dbError) {
        console.error(`Error saving order or updating stock for session ${session.id}:`, dbError);
        return response.status(500).json({ error: 'Failed to save order or update stock' });
      }
      break;
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  response.json({received: true});
});

app.use(express.json()); // Body parser for JSON requests

// Mount Routers
app.use('/api/auth', authRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/products', productRoutes);

// Original Checkout Session Creation
app.post('/api/create-checkout-session', async (req, res) => {
  const { cartItems, userId /*, customerEmail */ } = req.body; // Optionally get customerEmail if known

  if (!cartItems || cartItems.length === 0) {
    return res.status(400).json({ error: 'Cart is empty' });
  }

  try {
    const line_items = await Promise.all(cartItems.map(async (cartItem) => {
      const product = await Product.findOne({ id_from_js: cartItem.id });

      if (!product) {
        console.error(`Product with ID ${cartItem.id} not found in database.`);
        throw new Error(`One of the products in your cart (ID: ${cartItem.id}) was not found. Please refresh your cart or contact support.`);
      }
       console.log(`[Checkout Session] Product found: ${product.name}, DB ID: ${product._id}`);

      let imageUrl = null;
      if (product.image) {
        if (product.image.startsWith('http')) {
          imageUrl = product.image;
        } else {
          const imagePath = product.image.startsWith('/') ? product.image : `/${product.image}`;
          // Ensure IMAGE_BASE_URL is publicly accessible by Stripe for image fetching.
          // 'localhost' URLs won't work unless you're using a tunnel like ngrok for development.
          imageUrl = `${IMAGE_BASE_URL}${imagePath}`;
        }
      }

      return {
        price_data: {
          currency: 'gbp',
          product_data: {
            name: product.name,
            images: imageUrl ? [imageUrl] : [],
            description: product.description,
            metadata: {
                dbProductId: product._id.toString()
            }
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: cartItem.quantity,
      };
    }));

    const sessionParams = {
      payment_method_types: ['card'],
      line_items: line_items,
      mode: 'payment',
      // --- START OF MODIFICATIONS FOR SHIPPING AND INVOICE ---
      shipping_address_collection: {
        allowed_countries: ['GB', 'US', 'CA', 'AU'], // Specify countries you ship to. 'GB' for UK.
      },
      invoice_creation: { // Enable automatic invoice creation by Stripe
        enabled: true,
      },
      // Stripe will automatically attempt to email the customer a receipt upon successful payment
      // if an email is provided and enabled in your Stripe Dashboard.
      // To ensure Stripe creates/uses a customer record:
      customer_creation: 'if_required', // Creates a Stripe Customer if one doesn't exist for the email.
      // --- END OF MODIFICATIONS FOR SHIPPING AND INVOICE ---
      success_url: `${FRONTEND_URL}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `$${FRONTEND_URL}/checkout-cancel`,
      metadata: {},
      // If you have the customer's email, you can pre-fill it for Stripe Checkout:
      // customer_email: customerEmail, // Uncomment and pass if you have it
    };

    if (userId) {
      sessionParams.metadata.userId = userId;
      // Example: If you want to pre-fill email for logged-in users:
      // try {
      //   const user = await User.findById(userId); // Assuming you have a User model
      //   if (user && user.email) {
      //     sessionParams.customer_email = user.email;
      //   }
      // } catch (err) {
      //   console.warn("Could not fetch user email for Stripe session:", err);
      // }
    }
    // If customer_email is not provided, Stripe Checkout will ask for it.

    const checkoutSession = await stripe.checkout.sessions.create(sessionParams);
    res.json({ sessionId: checkoutSession.id });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    if (error.message.includes("not found")) {
        return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: 'Failed to create checkout session. ' + error.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Node server listening on port ${PORT}`);
});