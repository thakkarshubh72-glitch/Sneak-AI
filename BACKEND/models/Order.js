const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    sneaker: { type: mongoose.Schema.Types.ObjectId, ref: 'Sneaker' },
    name: String,
    brand: String,
    size: Number,
    quantity: Number,
    price: Number,
  }],
  shippingAddress: {
    firstName: String,
    lastName: String,
    address: String,
    city: String,
    state: String,
    zip: String,
    country: String,
  },
  subtotal: { type: Number, required: true },
  shipping: { type: Number, default: 0 },
  tax: { type: Number, default: 0 },
  total: { type: Number, required: true },
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed', 'refunded'],
    default: 'pending',
  },
  paymentIntentId: String,
  deliveryStatus: {
    type: String,
    enum: ['processing', 'shipped', 'in-transit', 'delivered', 'returned'],
    default: 'processing',
  },
  trackingNumber: String,
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
