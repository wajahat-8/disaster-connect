const express = require('express');
const router = express.Router();
const {
  getProfile,
  updateProfile,
  changeRole,
  updateAvailability,
  getAllUsers,
  getUserById,
  deleteAccount
} = require('../controllers/userController');
const { protect, authorize } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// User profile routes
router.route('/profile')
  .get(getProfile)
  .put(updateProfile)
  .delete(deleteAccount);

// Role management
router.put('/role', changeRole);

// Volunteer availability (volunteers only)
router.put('/availability', authorize('volunteer'), updateAvailability);

// Admin only routes
router.get('/', authorize('admin'), getAllUsers);
router.get('/:id', authorize('admin'), getUserById);

module.exports = router;