// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', // Reference to the User model
      // required: true, // Make it true if orders must be tied to a registered user
    },
    // If user is not registered, you might store guest email directly
    guestEmail: {
      type: String,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    orderItems: [
      {
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        image: { type: String }, // URL or path
        price: { type: Number, required: true }, // Price at the time of purchase
        product_id_from_js: { type: Number }, // To link back to your products.js ID if needed
        // product: { // If products are in DB
        //   type: mongoose.Schema.ObjectId,
        //   ref: 'Product',
        //   required: true
        // }
      },
    ],
    shippingAddress: { // If you collect this in Stripe Checkout
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    paymentMethod: {
      type: String,
      default: 'Stripe',
    },
    paymentResult: { // Details from Stripe
      id: { type: String },         // Stripe Payment Intent ID or Checkout Session ID
      status: { type: String },     // e.g., 'succeeded', 'pending'
      update_time: { type: String },
      email_address: { type: String }, // Customer email from Stripe
    },
    taxPrice: { // Calculate and store if needed
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: { // If applicable
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: { // Amount paid (in your primary currency, e.g., GBP)
      type: Number,
      required: true,
      default: 0.0,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Paid', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
    isPaid: {
      type: Boolean,
      default: false,
    },
    paidAt: {
      type: Date,
    },
    isDelivered: { // If you track delivery
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    stripeCheckoutSessionId: { // Store the Stripe session ID for reference
        type: String,
        unique: true,
    }
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  }
);

module.exports = mongoose.model('Order', OrderSchema);