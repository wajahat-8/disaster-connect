const express = require('express');
const router = express.Router();
const {
  createAlert,
  getAlerts
} = require('../controllers/notificationController');
const { protect, authorize } = require('../middleware/auth');

// Get all alerts (authenticated users)
router.get('/', protect, getAlerts);

// Create and send alert (Admin only)
router.post('/', protect, authorize('admin'), createAlert);

module.exports = router;
