const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();
const authRoutes = require('./routes/auth.js'); // for login/register
const bookRoutes = require('./routes/bookRoutes.js'); // for book APIs
const orderRoutes = require('./routes/order.js');
const cors = require('cors');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.log('❌ MongoDB connection failed:', err));

// Routes
app.use('/api/auth', authRoutes);       // /api/register, /api/login
app.use('/api/books', bookRoutes); // /api/books (POST, GET, etc.)
app.use('/api/orders', orderRoutes);



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
