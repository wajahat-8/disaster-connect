const User = require('../models/User');

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile'
    });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const allowedUpdates = [
      'name',
      'email',
      'phone', 
      'skills', 
      'location', 
      'availability', 
      'profileImage',
      'role'
    ];

    const updates = {};
    
    // Filter only allowed fields
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    // Handle location update - can be string (address) or object (coordinates)
    if (updates.location !== undefined) {
      if (typeof updates.location === 'string') {
        // If location is a string, update only the address field
        updates['location.address'] = updates.location;
        delete updates.location;
      } else if (typeof updates.location === 'object') {
        // If location is an object, validate coordinates if provided
        if (updates.location.coordinates && updates.location.coordinates.length !== 2) {
          return res.status(400).json({
            success: false,
            message: 'Invalid location format. Coordinates must be [longitude, latitude]'
          });
        }
      }
    }

    // Use findById and save to properly handle nested location updates
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Apply updates
    Object.keys(updates).forEach(key => {
      if (key.includes('.')) {
        // Handle nested updates like 'location.address'
        const keys = key.split('.');
        let obj = user;
        for (let i = 0; i < keys.length - 1; i++) {
          if (!obj[keys[i]]) {
            obj[keys[i]] = {};
          }
          obj = obj[keys[i]];
        }
        obj[keys[keys.length - 1]] = updates[key];
      } else {
        user[key] = updates[key];
      }
    });

    await user.save();

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully',
      user
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to update profile'
    });
  }
};

// @desc    Change user role
// @route   PUT /api/users/role
// @access  Private
exports.changeRole = async (req, res) => {
  try {
    const { role } = req.body;

    // Validate role
    if (!role || !['user', 'volunteer'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Only "user" or "volunteer" allowed'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Don't allow changing role if already admin
    if (user.role === 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin role cannot be changed'
      });
    }

    user.role = role;
    
    // If becoming volunteer, ensure availability is set
    if (role === 'volunteer' && user.availability === undefined) {
      user.availability = false;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: `Role changed to ${role} successfully`,
      user
    });
  } catch (error) {
    console.error('Change role error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change role'
    });
  }
};

// @desc    Update volunteer availability
// @route   PUT /api/users/availability
// @access  Private (Volunteers only)
exports.updateAvailability = async (req, res) => {
  try {
    const { availability } = req.body;

    if (typeof availability !== 'boolean') {
      return res.status(400).json({
        success: false,
        message: 'Availability must be a boolean value'
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.role !== 'volunteer') {
      return res.status(403).json({
        success: false,
        message: 'Only volunteers can update availability'
      });
    }

    user.availability = availability;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Availability updated successfully',
      availability: user.availability
    });
  } catch (error) {
    console.error('Update availability error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update availability'
    });
  }
};

// @desc    Get all users (Admin only)
// @route   GET /api/users
// @access  Private/Admin
exports.getAllUsers = async (req, res) => {
  try {
    const { role, isActive, page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};
    if (role) query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';

    const users = await User.find(query)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const count = await User.countDocuments(query);

    res.status(200).json({
      success: true,
      count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      users
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users'
    });
  }
};

// @desc    Get user by ID (Admin only)
// @route   GET /api/users/:id
// @access  Private/Admin
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch user'
    });
  }
};

// @desc    Delete user account
// @route   DELETE /api/users/profile
// @access  Private
exports.deleteAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Soft delete - deactivate instead of removing
    user.isActive = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: 'Account deactivated successfully'
    });
  } catch (error) {
    console.error('Delete account error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete account'
    });
  }
};