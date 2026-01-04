const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
    createDonation,
    getDonations,
    getUserDonations,
    getDonationSummary
} = require('../controllers/donationController');

// Helper to check for admin
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(403).json({ success: false, error: 'Not authorized as an admin' });
    }
};

router.post('/', protect, createDonation);
router.get('/my-donations', protect, getUserDonations);
router.get('/', protect, adminOnly, getDonations);
router.get('/summary', protect, adminOnly, getDonationSummary);

module.exports = router;
