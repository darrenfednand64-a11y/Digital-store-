const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const { v4: uuidv4 } = require('uuid');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// TEMP DATABASE (in memory) - Replace with MongoDB later
let orders = {};

// ==================== ROUTES ====================

// CREATE ORDER + TOKEN
app.post('/api/create-order', (req, res) => {
  const { product, email } = req.body;

  if (!product || !email) {
    return res.status(400).json({ error: 'Product and email are required' });
  }

  const token = uuidv4();
  const expiresAt = Date.now() + (60 * 60 * 1000); // 1 hour expiry

  orders[token] = {
    product,
    email,
    used: false,
    createdAt: Date.now(),
    expiresAt: expiresAt
  };

  res.json({ 
    success: true,
    token,
    message: 'Order created successfully'
  });
});

// DOWNLOAD ROUTE
app.get('/api/download', (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ error: 'Token is required' });
  }

  const order = orders[token];

  // Check if token exists
  if (!order) {
    return res.status(403).json({ error: 'Invalid or expired link' });
  }

  // Check if link is already used
  if (order.used) {
    return res.status(403).json({ error: 'Link has already been used' });
  }

  // Check if token has expired
  if (Date.now() > order.expiresAt) {
    return res.status(403).json({ error: 'Link has expired' });
  }

  // Mark as used
  order.used = true;

  // Redirect to file based on product type
  if (order.product === 'forex') {
    return res.redirect('https://drive.google.com/your-forex-file-link');
  }

  if (order.product === 'ebook') {
    return res.redirect('https://drive.google.com/your-ebook-link');
  }

  return res.status(400).json({ error: 'Unknown product type' });
});

// GET ORDER STATUS
app.get('/api/order/:token', (req, res) => {
  const { token } = req.params;

  const order = orders[token];

  if (!order) {
    return res.status(404).json({ error: 'Order not found' });
  }

  res.json({
    product: order.product,
    email: order.email,
    used: order.used,
    createdAt: new Date(order.createdAt).toISOString(),
    expiresAt: new Date(order.expiresAt).toISOString()
  });
});

// HEALTH CHECK
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

// ==================== START SERVER ====================
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`✅ Server running on http://localhost:${PORT}`);
});
