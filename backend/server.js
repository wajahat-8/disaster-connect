// D:/disaster-connect/disaster-connect-backend/server.js

const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors'); // This line was causing the error

// Load environment variables from .env file
dotenv.config();

// Import routes
const authRoutes = require('./routes/authRoutes');

const app = express();

// --- MIDDLEWARE ---
// Enable CORS for all routes
app.use(cors());

// Body parser to read JSON from request body
app.use(express.json());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('✅ MongoDB connected successfully!'))
    .catch(err => console.error('❌MongoDB connection error:', err));

// --- ROUTES ---
// Mount the authentication routes
app.use('/api/auth', authRoutes);

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});