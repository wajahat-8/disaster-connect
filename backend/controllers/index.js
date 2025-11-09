const authController = require('./auth/authController');
const userController = require('./auth/userController');
const adminController = require('./auth/adminController');

module.exports = {
  auth: authController,
  user: userController,
  admin: adminController
};