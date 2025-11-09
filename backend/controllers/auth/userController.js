const User = require('../../models/userModel');

// Get User Profile
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      status: 'success',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching profile.', error: error.message });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, email, phone, role, skills, location } = req.body;
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (location) user.location = location;
    if (skills) user.skills = Array.isArray(skills) ? skills : skills.split(',').map(s => s.trim());
    
    // Only allow changing role to volunteer
    if (role === 'volunteer' && user.role === 'user') {
      user.role = 'volunteer';
    }

    await user.save();

    res.status(200).json({
      status: 'success',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        location: user.location,
        skills: user.skills
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating profile.', error: error.message });
  }
};