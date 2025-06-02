// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController'); // Assuming these are defined elsewhere
const { protect, authorize } = require('../middleware/authMiddleware');
const Order = require('../Models/Order'); // Added: Import the Order model

// User routes
router.route('/myorders').get(protect, getMyOrders);

// GET order details by Stripe Session ID (for checkout success page)
router.get('/by-session/:sessionId', async (req, res) => {
  try {
    const order = await Order.findOne({ stripeCheckoutSessionId: req.params.sessionId })
      // Optionally populate user if you store user refs and need user details on success page
      // .populate('user', 'name email'); 

    if (order) {
      res.json(order);
    } else {
      // It's possible the user hits this page *just* before the webhook fully processes.
      // Or if the session ID is invalid.
      console.log(`[Order Route] Order not found for session ID: ${req.params.sessionId}. This might be due to webhook delay or invalid ID.`);
      res.status(404).json({ message: 'Order details are being processed or session ID is invalid. You will receive a confirmation email shortly.' });
    }
  } catch (error) {
    console.error(`[Order Route] Error fetching order by session ID ${req.params.sessionId}:`, error);
    res.status(500).json({ message: 'Server error while fetching order details.' });
  }
});

// This route needs to be specific enough not to clash with /by-session/:sessionId
// So, ensure :id is typically a MongoDB ObjectId. Stripe session IDs are longer and start with 'cs_'.
// If your getOrderById controller might also be hit by a string that isn't an ObjectId,
// you might need to add ObjectId validation in that controller or make this route more specific.
router.route('/:id').get(protect, getOrderById);


// Admin routes
router.route('/').get(protect, authorize('admin'), getAllOrders);
router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;