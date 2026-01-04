const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');
const {
    reportLostItem,
    reportFoundItem,
    getAllItems,
    getMatches,
    deleteItem,
    adminDeleteItem
} = require('../controllers/lostFoundController');

// Report Lost/Found Items (with image upload)
router.post('/lost', protect, upload.single('image'), reportLostItem);
router.post('/found', protect, upload.single('image'), reportFoundItem);

// Public feed
router.get('/all', getAllItems);

// Get matches
router.get('/matches', protect, getMatches);

// Delete item (owner only)
router.delete('/:id', protect, deleteItem);

// Admin delete any item
router.delete('/admin/:id', protect, authorize('admin'), adminDeleteItem);

module.exports = router;
