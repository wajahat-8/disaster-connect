/**
 * Quick seed helper to create an admin user if none exists.
 * Usage: from backend dir -> npm run seed
 */
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const User = require('../models/User');

(async () => {
  try {
    await connectDB();
    const adminEmail = 'admin@disaster.local';
    let admin = await User.findOne({ email: adminEmail });
    if (admin) {
      console.log('Admin already exists:', adminEmail);
      process.exit(0);
    }
    const hashed = await bcrypt.hash('Admin@123', 10);
    admin = await User.create({
      name: 'Admin',
      email: adminEmail,
      password: hashed,
      role: 'admin',
      isVerified: true
    });
    console.log('Created admin:', adminEmail, 'password: Admin@123');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
