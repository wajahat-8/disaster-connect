const DisasterReport = require('../models/DisasterReport');
const User = require('../models/User');

// @desc    Create new disaster report
// @route   POST /api/disasters
// @access  Private
exports.createDisaster = async (req, res) => {
  try {
    const { type, description, severity, coordinates, address } = req.body;

    // Validate required fields
    if (!type || !description || !coordinates) {
      return res.status(400).json({
        success: false,
        message: 'Type, description, and coordinates are required'
      });
    }

    // Handle image upload (if multer is used, req.file will contain the image)
    const imageUrl = req.file ? `/uploads/disasters/${req.file.filename}` : req.body.image || '';

    // Parse coordinates - could be stringified JSON array or object
    let parsedCoordinates;
    if (typeof coordinates === 'string') {
      try {
        parsedCoordinates = JSON.parse(coordinates);
      } catch (e) {
        return res.status(400).json({
          success: false,
          message: 'Invalid coordinates format'
        });
      }
    } else {
      parsedCoordinates = coordinates;
    }

    // Ensure coordinates is [longitude, latitude] array
    const finalCoordinates = Array.isArray(parsedCoordinates)
      ? parsedCoordinates
      : [parsedCoordinates.longitude, parsedCoordinates.latitude];

    const disaster = await DisasterReport.create({
      type,
      description,
      severity: severity || 'medium',
      location: {
        type: 'Point',
        coordinates: finalCoordinates,
        address: address || ''
      },
      image: imageUrl,
      createdBy: req.user.id
    });

    // Populate creator info
    await disaster.populate('createdBy', 'name email phone');

    res.status(201).json({
      success: true,
      message: 'Disaster report created successfully',
      disaster
    });
  } catch (error) {
    console.error('Create disaster error:', error);
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to create disaster report'
    });
  }
};

// @desc    Get all disaster reports
// @route   GET /api/disasters
// @access  Public
exports.getDisasters = async (req, res) => {
  try {
    const { type, severity, status, verified, limit = 50, page = 1 } = req.query;

    // Build query
    const query = {};
    if (type) query.type = type.toLowerCase();
    if (severity) query.severity = severity.toLowerCase();
    if (status) query.status = status;
    if (verified !== undefined) query.verified = verified === 'true';

    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit);

    const disasters = await DisasterReport.find(query)
      .populate('createdBy', 'name email phone')
      .populate('verifiedBy', 'name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip(skip);

    const total = await DisasterReport.countDocuments(query);

    res.status(200).json({
      success: true,
      count: disasters.length,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      disasters
    });
  } catch (error) {
    console.error('Get disasters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disaster reports'
    });
  }
};

// @desc    Get disaster by ID
// @route   GET /api/disasters/:id
// @access  Public
exports.getDisasterById = async (req, res) => {
  try {
    const disaster = await DisasterReport.findById(req.params.id)
      .populate('createdBy', 'name email phone')
      .populate('verifiedBy', 'name');

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster report not found'
      });
    }

    res.status(200).json({
      success: true,
      disaster
    });
  } catch (error) {
    console.error('Get disaster by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch disaster report'
    });
  }
};

// @desc    Verify disaster report (Admin only)
// @route   PUT /api/disasters/:id/verify
// @access  Private/Admin
exports.verifyDisaster = async (req, res) => {
  try {
    const { verified } = req.body;

    const disaster = await DisasterReport.findById(req.params.id);

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster report not found'
      });
    }

    disaster.verified = verified !== undefined ? verified : true;
    disaster.verifiedBy = req.user.id;
    disaster.verifiedAt = new Date();

    await disaster.save();

    await disaster.populate('verifiedBy', 'name');

    res.status(200).json({
      success: true,
      message: `Disaster report ${disaster.verified ? 'verified' : 'unverified'} successfully`,
      disaster
    });
  } catch (error) {
    console.error('Verify disaster error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to verify disaster report'
    });
  }
};

// @desc    Get disasters near a location
// @route   GET /api/disasters/nearby
// @access  Public
exports.getNearbyDisasters = async (req, res) => {
  try {
    const { lat, lng, radius = 10 } = req.query; // radius in kilometers

    if (!lat || !lng) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const disasters = await DisasterReport.find({
      location: {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng), parseFloat(lat)]
          },
          $maxDistance: parseFloat(radius) * 1000 // Convert km to meters
        }
      },
      status: { $ne: 'resolved' } // Exclude resolved disasters
    })
      .populate('createdBy', 'name email phone')
      .sort({ createdAt: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      count: disasters.length,
      disasters
    });
  } catch (error) {
    console.error('Get nearby disasters error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch nearby disasters'
    });
  }
};

// @desc    Delete disaster report (Admin only)
// @route   DELETE /api/disasters/:id
// @access  Private/Admin
exports.deleteDisaster = async (req, res) => {
  try {
    const disaster = await DisasterReport.findById(req.params.id);

    if (!disaster) {
      return res.status(404).json({
        success: false,
        message: 'Disaster report not found'
      });
    }

    await DisasterReport.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Disaster report deleted successfully'
    });
  } catch (error) {
    console.error('Delete disaster error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete disaster report'
    });
  }
};
