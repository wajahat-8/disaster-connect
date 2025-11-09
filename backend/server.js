const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Load environment variables from .env file
dotenv.config();

// Validate required environment variables with helpful messages
if (!process.env.JWT_SECRET) {
  console.error('❌ ERROR: Missing JWT_SECRET in environment');
  console.error('📝 Please create a .env file in the backend folder with:');
  console.error('   JWT_SECRET=your-secret-key-here');
  console.error('   MONGO_URI=mongodb://localhost:27017/disaster_connect');
  process.exit(1);
}

// Import routes
const routes = require('./routes');

const app = express();

// --- MIDDLEWARE ---
// Enable CORS with sensible defaults for Expo/React Native
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser to read JSON from request body
app.use(express.json());

// --- DATABASE CONNECTION ---
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error('❌ ERROR: Missing MONGO_URI in environment');
  console.error('📝 Please create a .env file in the backend folder with:');
  console.error('   MONGO_URI=mongodb://localhost:27017/disaster_connect');
  console.error('   JWT_SECRET=your-secret-key-here');
  process.exit(1);
}

mongoose.connect(mongoUri)
  .then(() => console.log('✅ MongoDB connected successfully!'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// --- ROUTES ---
// Health check for uptime monitoring
app.get('/health', (req, res) => res.status(200).json({ status: 'ok' }));

// Mount all API routes
app.use('/api', routes);

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});

// Graceful shutdown and unhandled errors
process.on('unhandledRejection', (err) => {
  console.error('Unhandled Rejection:', err);
  server.close(() => process.exit(1));
});

process.on('SIGINT', () => {
  server.close(() => process.exit(0));
});
