const express = require('express');
const router = express.Router();
const {
  createDisaster,
  getDisasters,
  getDisasterById,
  verifyDisaster,
  getNearbyDisasters
} = require('../controllers/disasterController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

// Public routes
router.get('/', getDisasters);
router.get('/nearby', getNearbyDisasters);
router.get('/:id', getDisasterById);

// Protected routes
router.post('/', protect, upload.single('image'), createDisaster);

// Admin only routes
router.put('/:id/verify', protect, authorize('admin'), verifyDisaster);

module.exports = router;

