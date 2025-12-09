const express = require('express');
const router = express.Router();
const {
    getShelters,
    getShelter,
    createShelter,
    updateShelter,
    deleteShelter
} = require('../controllers/shelterController');

const { protect } = require('../middleware/auth');

// Simple admin check middleware
const admin = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next();
    } else {
        res.status(401).json({ success: false, message: 'Not authorized as admin' });
    }
};

router.route('/')
    .get(getShelters)
    .post(protect, admin, createShelter);

router.route('/:id')
    .get(getShelter)
    .put(protect, admin, updateShelter)
    .delete(protect, admin, deleteShelter);

module.exports = router;
