const express = require('express');
const Order = require('../models/Order');
const Cart = require('../models/Cart');
const auth = require('../middleware/auth');
const router = express.Router();

// POST /api/orders — create order
router.post('/', auth, async (req, res) => {
  try {
    const { items, shippingAddress, subtotal, shipping, tax, total, paymentIntentId } = req.body;

    const order = new Order({
      user: req.user._id,
      items,
      shippingAddress,
      subtotal,
      shipping,
      tax,
      total,
      paymentIntentId,
      paymentStatus: 'paid',
    });

    await order.save();

    // Clear user's cart after order
    await Cart.findOneAndDelete({ user: req.user._id });

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders — get user's orders
router.get('/', auth, async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id })
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/orders/:id — get single order
router.get('/:id', auth, async (req, res) => {
  try {
    const order = await Order.findOne({ _id: req.params.id, user: req.user._id });
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
