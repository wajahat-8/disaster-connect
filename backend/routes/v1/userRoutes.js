const express = require('express');
const { user } = require('../../controllers');
const { auth } = require('../../middleware/auth');
const router = express.Router();

// Protected user routes
router.use(auth); // Middleware for all user routes

// Profile routes
router.get('/profile', user.getProfile);
router.put('/profile', user.updateProfile);

module.exports = router;