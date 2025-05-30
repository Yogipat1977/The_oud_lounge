// config/db.js
const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) {
      console.error('FATAL ERROR: MONGO_URI is not defined in your environment variables.');
      process.exit(1);
    }
    console.log('Attempting to connect to MongoDB Atlas...');
    // For Mongoose 6+ these options are default or deprecated
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
    await mongoose.connect(mongoURI);
    console.log('MongoDB Connected...');
  } catch (err) {
    // Log the full error object for more details, not just err.message
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;