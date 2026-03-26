const express = require('express');
const Sneaker = require('../models/Sneaker');
const router = express.Router();

// GET /api/sneakers — list all with filters, pagination, sorting
router.get('/', async (req, res) => {
  try {
    const { brand, style, category, minPrice, maxPrice, search, sort, limit = 40, page = 1 } = req.query;
    const filter = {};

    if (brand) filter.brand = brand;
    if (style) filter.style = style;
    if (category) filter.category = category;
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (search) {
      filter.$text = { $search: search };
    }

    let sortOption = {};
    switch (sort) {
      case 'price-low': sortOption = { price: 1 }; break;
      case 'price-high': sortOption = { price: -1 }; break;
      case 'rating': sortOption = { rating: -1 }; break;
      case 'newest': sortOption = { createdAt: -1 }; break;
      default: sortOption = { isTrending: -1, rating: -1 }; break;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [sneakers, total] = await Promise.all([
      Sneaker.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Sneaker.countDocuments(filter),
    ]);

    res.json({
      sneakers,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sneakers/search — text-based search
router.get('/search', async (req, res) => {
  try {
    const { q, limit = 20 } = req.query;
    if (!q) return res.json({ sneakers: [], total: 0 });

    const sneakers = await Sneaker.find(
      { $text: { $search: q } },
      { score: { $meta: 'textScore' } }
    )
      .sort({ score: { $meta: 'textScore' } })
      .limit(Number(limit));

    res.json({ sneakers, total: sneakers.length });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sneakers/filter — advanced filtering
router.get('/filter', async (req, res) => {
  try {
    const { brands, styles, categories, minPrice, maxPrice, minRating, inStock, sort, limit = 40, page = 1 } = req.query;
    const filter = {};

    if (brands) filter.brand = { $in: brands.split(',') };
    if (styles) filter.style = { $in: styles.split(',') };
    if (categories) filter.category = { $in: categories.split(',') };
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }
    if (minRating) filter.rating = { $gte: Number(minRating) };
    if (inStock === 'true') filter.stock = { $gt: 0 };

    let sortOption = {};
    switch (sort) {
      case 'price-low': sortOption = { price: 1 }; break;
      case 'price-high': sortOption = { price: -1 }; break;
      case 'rating': sortOption = { rating: -1 }; break;
      case 'newest': sortOption = { createdAt: -1 }; break;
      case 'popular': sortOption = { reviews: -1 }; break;
      default: sortOption = { isTrending: -1, rating: -1 }; break;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const [sneakers, total] = await Promise.all([
      Sneaker.find(filter).sort(sortOption).skip(skip).limit(Number(limit)),
      Sneaker.countDocuments(filter),
    ]);

    // Get available filter values for UI
    const [allBrands, allStyles, allCategories, priceRange] = await Promise.all([
      Sneaker.distinct('brand'),
      Sneaker.distinct('style'),
      Sneaker.distinct('category'),
      Sneaker.aggregate([{ $group: { _id: null, min: { $min: '$price' }, max: { $max: '$price' } } }]),
    ]);

    res.json({
      sneakers,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      filters: {
        brands: allBrands.sort(),
        styles: allStyles.sort(),
        categories: allCategories.sort(),
        priceRange: priceRange[0] || { min: 0, max: 1500 },
      },
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/sneakers/:id — get single sneaker
router.get('/:id', async (req, res) => {
  try {
    const sneaker = await Sneaker.findById(req.params.id);
    if (!sneaker) return res.status(404).json({ error: 'Sneaker not found' });
    res.json(sneaker);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
