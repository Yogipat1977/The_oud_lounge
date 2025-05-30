// models/Product.js
const mongoose = require('mongoose');

const ProductSchema = new mongoose.Schema(
  { // First argument: Schema Definition
    id_from_js: {
      type: Number,
      unique: true,    // This also creates an index
      required: true   // Good to have if this ID is essential
    },
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    image: { type: String },
    rating: { type: Number },      // Add if you want to store rating
    reviews: { type: Number },     // Add if you want to store reviews
    category: { type: String },
    stockQuantity: { type: Number, default: 100 },
    createdAt: { type: Date, default: Date.now } // Good practice
  },
  { // Second argument: Schema Options
    collection: 'perfumes' // Explicitly specify the collection name
    // timestamps: true // Another common option to automatically add createdAt and updatedAt
  }
);

// No need for ProductSchema.index({ id_from_js: 1 }); if unique:true is used on id_from_js

module.exports = mongoose.model('Product', ProductSchema);