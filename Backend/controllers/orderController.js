// controllers/orderController.js
const Order = require('../Models/Order');
// const Product = require('../models/Product'); // If products are in DB for stock update

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
exports.getMyOrders = async (req, res) => {
  try {
    // req.user.id comes from the 'protect' middleware
    const orders = await Order.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching user orders' });
  }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
exports.getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      'user',
      'name email' // Populate user details
    );

    if (order) {
      // Ensure the logged-in user is the owner of the order or an admin
      if (order.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Not authorized to view this order' });
      }
      res.json(order);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching order' });
  }
};


// --- ADMIN ONLY ---

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error fetching all orders' });
  }
};

// @desc    Update order status (e.g., to shipped, delivered)
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
exports.updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      // Update fields based on req.body
      order.orderStatus = req.body.orderStatus || order.orderStatus;

      if (req.body.orderStatus === 'Delivered' && !order.isDelivered) {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }
       if (req.body.orderStatus === 'Paid' && !order.isPaid) {
        order.isPaid = true;
        order.paidAt = Date.now();
      }
      // Add more status updates as needed

      const updatedOrder = await order.save();
      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error updating order status' });
  }
};