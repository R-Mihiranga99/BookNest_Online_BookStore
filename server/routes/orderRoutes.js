const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const authMiddleware = require('../middleware/authMiddleware');

console.log('Incoming order:', req.body);

// Create new order (Checkout)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { items, shippingAddress, paymentMethod, subtotal, tax, total } = req.body;

    // Validate required fields
    if (!items || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    if (
      !shippingAddress ||
      !shippingAddress.fullName ||
      !shippingAddress.email ||
      !shippingAddress.phone ||
      !shippingAddress.address ||
      !shippingAddress.city ||
      !shippingAddress.postalCode ||
      !shippingAddress.country
    ) {
      return res.status(400).json({ message: 'Complete shipping address is required' });
    }


    const order = new Order({
      user: req.user.id,
      items,
      shippingAddress,
      paymentMethod,
      subtotal,
      tax,
      total,
      status: 'pending'
    });

    const savedOrder = await order.save();
    
    res.status(201).json({ 
      message: 'Order placed successfully', 
      order: savedOrder 
    });
  } catch (error) {
    console.error('Order creation error:', error);
    res.status(500).json({ 
      message: 'Failed to place order', 
      error: error.message 
    });
  }
});

// Get user's orders
router.get('/', authMiddleware, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .sort({ orderDate: -1 }); // Most recent first
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to fetch orders', 
      error: err.message 
    });
  }
});

// Get single order by ID
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user (unless admin)
    if (order.user.toString() !== req.user.id && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(order);
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to fetch order', 
      error: err.message 
    });
  }
});

// Update order status (for admin or order tracking)
router.patch('/:id/status', authMiddleware, async (req, res) => {
  try {
    const { status } = req.body;
    
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json({ message: 'Order status updated', order });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to update order', 
      error: err.message 
    });
  }
});

// Admin: Get all orders
router.get('/admin/all', authMiddleware, async (req, res) => {
  try {
    // Check if user is admin
    if (!req.user.isAdmin) {
      return res.status(403).json({ message: 'Access denied: Admins only' });
    }

    const orders = await Order.find()
      .populate('user', 'username email')
      .sort({ orderDate: -1 });
    
    res.json(orders);
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to fetch all orders', 
      error: err.message 
    });
  }
});

// Cancel order
router.patch('/:id/cancel', authMiddleware, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order belongs to user
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Access denied' });
    }

    // Only allow cancellation if order is pending or processing
    if (!['pending', 'processing'].includes(order.status)) {
      return res.status(400).json({ 
        message: 'Cannot cancel order at this stage' 
      });
    }

    order.status = 'cancelled';
    await order.save();

    res.json({ message: 'Order cancelled successfully', order });
  } catch (err) {
    res.status(500).json({ 
      message: 'Failed to cancel order', 
      error: err.message 
    });
  }
});

module.exports = router;