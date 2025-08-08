const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  phone: { type: String },
  password: { type: String, required: true },
  role: { type: String, enum: ['user','volunteer','admin','shelter_manager'], default: 'user' },
  isVerified: { type: Boolean, default: false },
  profilePic: String,
  activities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Report' }],
  fcmToken: String,
  preferences: {
    receiveAlerts: { type: Boolean, default: true }
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
