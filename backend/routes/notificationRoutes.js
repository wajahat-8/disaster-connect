const express = require('express');
const router = express.Router();
const {
  registerToken,
  sendNotification
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

// Register/update FCM token
router.post('/register', protect, registerToken);

// Send notification (Admin only)
router.post('/send', protect, authorize('admin'), sendNotification);

module.exports = router;
