// models/Order.js
const mongoose = require('mongoose');

const OrderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', // Reference to the User model
      // required: false, // Explicitly not required for guest checkout
    },
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
        price: { type: Number, required: true }, // Price at the time of purchase (original unit price)
        product_id_from_js: { type: Number }, // To link back to your products.js ID if needed
        product: { // If products are in DB and you want to store the ObjectId ref
           type: mongoose.Schema.ObjectId,
           ref: 'Product',
           // required: true // make this true if you always link to a DB product
        }
      },
    ],
    shippingAddress: { 
      name: { type: String },
      address: { type: String },
      city: { type: String },
      postalCode: { type: String },
      country: { type: String },
    },
    paymentMethod: {
      type: String,
      default: 'Stripe',
    },
    paymentResult: { 
      id: { type: String },        
      status: { type: String },    
      update_time: { type: String },
      email_address: { type: String }, 
    },
    // Pricing breakdown
    subtotalBeforeDiscount: { // Sum of (item.price * item.quantity) using original prices
      type: Number,
      default: 0.0,
    },
    discountAmount: { // Amount discounted due to deals
      type: Number,
      default: 0.0,
    },
    dealApplied: { // Flag if a deal was used for this order
      type: Boolean,
      default: false,
    },
    taxPrice: { 
      type: Number,
      required: true,
      default: 0.0,
    },
    shippingPrice: { 
      type: Number,
      required: true,
      default: 0.0,
    },
    totalPrice: { // Final amount paid
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
    isDelivered: { 
      type: Boolean,
      default: false,
    },
    deliveredAt: {
      type: Date,
    },
    stripeCheckoutSessionId: { 
        type: String,
        unique: true,
    }
  },
  {
    timestamps: true, 
  }
);

module.exports = mongoose.model('Order', OrderSchema);