const express = require('express');
const { auth } = require('../../controllers');
const router = express.Router();

// Authentication routes
router.post('/register', auth.register);
router.post('/login', auth.login);
router.post('/logout', auth.logout);

// Password reset routes
router.post('/forgot-password', auth.forgotPassword);
router.post('/reset-password', auth.resetPassword);

module.exports = router;