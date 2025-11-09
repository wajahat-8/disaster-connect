const express = require('express');
const { admin } = require('../../controllers');
const { adminAuth } = require('../../middleware/auth');
const router = express.Router();

// Protect all admin routes
router.use(adminAuth);

// User management routes
router.post('/users', admin.adminRegister);
router.get('/users', admin.getAllUsers);
router.get('/users/:id', admin.getUserById);
router.put('/users/:id', admin.updateUser);
router.delete('/users/:id', admin.deleteUser);

// Statistics routes
router.get('/stats/users', admin.getUserStats);

module.exports = router;