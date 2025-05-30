// routes/authRoutes.js
const express = require('express');
const {
  registerUser,
  loginUser,
  getMe,
  updateUserDetails, // Import new controller
  updatePassword,    // Import new controller
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMe);
router.put('/updatedetails', protect, updateUserDetails); // New route for updating details
router.put('/updatepassword', protect, updatePassword); // New route for updating password

module.exports = router;