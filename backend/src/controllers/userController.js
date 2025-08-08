const User = require('../models/User');

exports.getMe = async (req, res) => {
  res.json(req.user);
};

exports.updateMe = async (req, res) => {
  try {
    const updates = (({ name, phone, profilePic, preferences, fcmToken }) => ({ name, phone, profilePic, preferences, fcmToken }))(req.body);
    const user = await User.findByIdAndUpdate(req.user._id, { $set: updates }, { new: true }).select('-password');
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// admin: list users
exports.listUsers = async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
};
