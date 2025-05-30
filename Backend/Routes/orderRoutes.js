// routes/orderRoutes.js
const express = require('express');
const router = express.Router();
const {
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const { protect, authorize } = require('../middleware/authMiddleware');

// User routes
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);

// Admin routes
router.route('/').get(protect, authorize('admin'), getAllOrders);
router.route('/:id/status').put(protect, authorize('admin'), updateOrderStatus);

module.exports = router;