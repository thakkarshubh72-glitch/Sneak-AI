require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const mongoose = require('mongoose');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 5000;

// Security Middleware
app.use(helmet());

// Rate Limiting (100 requests per 15 mins per IP)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests, please try again later." }
});
app.use(limiter);

// Middleware
app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    /^http:\/\/192\.168\.\d{1,3}\.\d{1,3}:3000$/,
    /^http:\/\/10\.\d{1,3}\.\d{1,3}\.\d{1,3}:3000$/,
  ],
  credentials: true,
}));
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/sneakai';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    console.log('⚠️  Server running without database. API routes requiring DB will not work.');
  }
};

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/sneakers', require('./routes/sneakers'));
app.use('/api/cart', require('./routes/cart'));
app.use('/api/orders', require('./routes/orders'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    mongodb: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// Get local network IP
function getLocalIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return '127.0.0.1';
}

// Start
connectDB().then(() => {
  app.listen(PORT, '0.0.0.0', () => {
    const localIP = getLocalIP();
    console.log('');
    console.log('╔══════════════════════════════════════════╗');
    console.log('║        🚀 SneakAI Backend Server         ║');
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  Local:    http://localhost:${PORT}         ║`);
    console.log(`║  Network:  http://${localIP}:${PORT}   ║`);
    console.log('╠══════════════════════════════════════════╣');
    console.log(`║  Frontend: http://localhost:3000          ║`);
    console.log(`║  AI Svc:   http://localhost:8000          ║`);
    console.log('╚══════════════════════════════════════════╝');
    console.log('');
    console.log('📋 Endpoints:');
    console.log('   GET  /api/health');
    console.log('   GET  /api/sneakers');
    console.log('   GET  /api/sneakers/search?q=...');
    console.log('   GET  /api/sneakers/filter?brands=...&styles=...');
    console.log('   GET  /api/sneakers/:id');
    console.log('   POST /api/auth/login');
    console.log('   POST /api/auth/register');
    console.log('');
  });
});
