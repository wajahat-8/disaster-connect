const express = require('express');
const authRoutes = require('./v1/authRoutes');
const userRoutes = require('./v1/userRoutes');
const adminRoutes = require('./v1/adminRoutes');

const router = express.Router();

// API version 1 routes
router.use('/v1/auth', authRoutes);
router.use('/v1/user', userRoutes);
router.use('/v1/admin', adminRoutes);

module.exports = router;