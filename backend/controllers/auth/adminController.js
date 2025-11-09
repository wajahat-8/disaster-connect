const User = require('../../models/userModel');

// Admin: Get All Users
exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password');
    res.status(200).json({
      status: 'success',
      results: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users.', error: error.message });
  }
};

// Admin: Get User by ID
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({
      status: 'success',
      data: user,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user.', error: error.message });
  }
};

// Admin: Update User
exports.updateUser = async (req, res) => {
  try {
    const { name, email, phone, role } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    if (name) user.name = name;
    if (email) user.email = email;
    if (phone) user.phone = phone;
    if (role) user.role = role;

    await user.save();

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
    res.status(500).json({ message: 'Error updating user.', error: error.message });
  }
};

// Admin: Delete User
exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user.', error: error.message });
  }
};

// Admin: Create User
exports.adminRegister = async (req, res) => {
  try {
    const { name, email, phone, password, role } = req.body;

    // Validate input
    if (!name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email is already registered.' });
    }

    // Create user with specified role
    const newUser = await User.create({ name, email, phone, password, role: role || 'user' });

    res.status(201).json({
      status: 'success',
      data: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error during user creation.', error: error.message });
  }
};