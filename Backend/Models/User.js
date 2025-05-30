// models/User.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const AddressSchema = new mongoose.Schema({
  street: { type: String },
  city: { type: String },
  state: { type: String }, // Or province/region
  postalCode: { type: String },
  country: { type: String },
  // isDefault: { type: Boolean, default: false } // If allowing multiple addresses
}, { _id: false }); // _id: false for subdocuments if not needed as separate entities

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please add a name'],
  },
  email: {
    type: String,
    required: [true, 'Please add an email'],
    unique: true,
    match: [
      /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
      'Please add a valid email',
    ],
  },
  password: {
    type: String,
    required: [true, 'Please add a password'],
    minlength: 6,
    select: false, // Don't return password by default when querying users
  },
  phoneNumber: {
    type: String,
    // You might add validation for phone numbers if needed
    // match: [/^\+[1-9]\d{1,14}$/, 'Please add a valid phone number with country code']
  },
  address: { // Default or primary address
    type: AddressSchema,
  },
  // If you want to allow multiple addresses for a user:
  // addresses: [AddressSchema],
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

// Encrypt password using bcrypt before saving
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare entered password with hashed password in DB
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', UserSchema);