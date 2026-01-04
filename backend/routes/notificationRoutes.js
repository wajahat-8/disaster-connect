const express = require('express');
const router = express.Router();
const {
  registerToken,
  sendNotification,
  getInbox,
  markAsRead,
  markAllAsRead,
  getUnreadCount,
  deleteNotification
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

// Register/update FCM token
router.post('/register', protect, registerToken);

// Send notification (Admin only)
router.post('/send', protect, authorize('admin'), sendNotification);

// Notification inbox endpoints
router.get('/inbox', protect, getInbox);
router.get('/unread-count', protect, getUnreadCount);
router.patch('/:id/read', protect, markAsRead);
router.delete('/:id', protect, deleteNotification);
router.patch('/read-all', protect, markAllAsRead);

module.exports = router;
