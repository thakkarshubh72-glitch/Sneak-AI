const mongoose = require('mongoose');

const sneakerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  brand: { type: String, required: true, index: true },
  price: { type: Number, required: true },
  currency: { type: String, default: 'INR' },
  originalPrice: Number,
  color: { type: String, required: true },
  colorHex: String,
  style: { type: String, required: true, enum: ['street', 'sport', 'casual', 'luxury'], index: true },
  category: String,
  description: { type: String, required: true },
  features: [String],
  sizes: [Number],
  stock: { type: Number, default: 100 },
  images: [String],
  image_urls: [String],
  model_3d_url: String,
  modelUrl: String,
  rating: { type: Number, default: 0 },
  reviews: { type: Number, default: 0 },
  isNew: { type: Boolean, default: false },
  isTrending: { type: Boolean, default: false },
  colorVariants: [{
    name: String,
    hex: String,
    secondary: String,
  }],
}, { timestamps: true });

sneakerSchema.index({ name: 'text', brand: 'text', description: 'text', color: 'text' });
sneakerSchema.index({ price: 1 });
sneakerSchema.index({ rating: -1 });

module.exports = mongoose.model('Sneaker', sneakerSchema);
