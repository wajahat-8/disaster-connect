const User = require('../models/User');
const Alert = require('../models/Alert');
const { sendNotification, sendMulticastNotification, sendTopicNotification } = require('../services/fcmService');
const asyncHandler = require('../middleware/asyncHandler');

/**
 * @route   POST /api/notifications/register
 * @desc    Register/update FCM token for user
 * @access  Private
 */
exports.registerToken = asyncHandler(async (req, res) => {
  const { fcmToken } = req.body;
  const userId = req.user.id;

  if (!fcmToken) {
    return res.status(400).json({
      success: false,
      message: 'FCM token is required'
    });
  }

  // Update user's FCM token
  const user = await User.findByIdAndUpdate(
    userId,
    { fcmToken },
    { new: true, runValidators: true }
  );

  if (!user) {
    return res.status(404).json({
      success: false,
      message: 'User not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'FCM token registered successfully',
    data: {
      userId: user._id,
      tokenRegistered: !!user.fcmToken
    }
  });
});

/**
 * @route   POST /api/notifications/send
 * @desc    Send notification to specific users or groups
 * @access  Private (Admin only)
 */
exports.sendNotification = asyncHandler(async (req, res) => {
  const { userIds, userRoles, title, body, data, topic } = req.body;

  if (!title || !body) {
    return res.status(400).json({
      success: false,
      message: 'Title and body are required'
    });
  }

  let fcmTokens = [];

  // Get FCM tokens based on criteria
  if (userIds && userIds.length > 0) {
    // Send to specific users
    const users = await User.find({
      _id: { $in: userIds },
      fcmToken: { $exists: true, $ne: '' },
      isActive: true
    }).select('fcmToken');
    fcmTokens = users.map(user => user.fcmToken).filter(token => token);
  } else if (userRoles && userRoles.length > 0) {
    // Send to users with specific roles
    const users = await User.find({
      role: { $in: userRoles },
      fcmToken: { $exists: true, $ne: '' },
      isActive: true
    }).select('fcmToken');
    fcmTokens = users.map(user => user.fcmToken).filter(token => token);
  } else if (topic) {
    // Send to topic
    try {
      const result = await sendTopicNotification(topic, { title, body }, data || {});
      return res.status(200).json({
        success: true,
        message: 'Notification sent to topic successfully',
        data: result
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Failed to send notification',
        error: error.message
      });
    }
  } else {
    return res.status(400).json({
      success: false,
      message: 'Please provide userIds, userRoles, or topic'
    });
  }

  if (fcmTokens.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No active users with FCM tokens found'
    });
  }

  try {
    const result = await sendMulticastNotification(
      fcmTokens,
      { title, body },
      data || {}
    );

    res.status(200).json({
      success: true,
      message: 'Notifications sent successfully',
      data: {
        totalTokens: fcmTokens.length,
        successCount: result.successCount,
        failureCount: result.failureCount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send notifications',
      error: error.message
    });
  }
});

/**
 * @route   POST /api/alerts
 * @desc    Create and send emergency alert (Admin only)
 * @access  Private (Admin only)
 */
exports.createAlert = asyncHandler(async (req, res) => {
  const {
    title,
    message,
    type = 'emergency',
    priority = 'high',
    targetAudience = 'all',
    location,
    metadata
  } = req.body;

  if (!title || !message) {
    return res.status(400).json({
      success: false,
      message: 'Title and message are required'
    });
  }

  // Create alert record
  const alert = await Alert.create({
    title,
    message,
    type,
    priority,
    targetAudience,
    location: location || {
      type: 'Point',
      coordinates: [0, 0],
      radius: 0
    },
    createdBy: req.user.id,
    metadata: metadata || {}
  });

  // Determine target users based on audience
  let query = { isActive: true, fcmToken: { $exists: true, $ne: '' } };

  if (targetAudience === 'volunteers') {
    query.role = 'volunteer';
  } else if (targetAudience === 'users') {
    query.role = 'user';
  } else if (targetAudience === 'admins') {
    query.role = 'admin';
  }
  // If 'all', query remains as is

  // If location is provided with radius, filter by location
  if (location && location.coordinates && location.radius > 0) {
    const users = await User.find(query).select('fcmToken location');
    const fcmTokens = users
      .filter(user => {
        if (!user.location || !user.location.coordinates) return false;
        const distance = calculateDistance(
          location.coordinates[1], // latitude
          location.coordinates[0], // longitude
          user.location.coordinates[1],
          user.location.coordinates[0]
        );
        return distance <= location.radius;
      })
      .map(user => user.fcmToken)
      .filter(token => token);

    // Send notifications
    if (fcmTokens.length > 0) {
      try {
        const result = await sendMulticastNotification(
          fcmTokens,
          { title, body: message },
          {
            type: 'alert',
            alertId: alert._id.toString(),
            alertType: type,
            priority
          }
        );

        alert.sent = true;
        alert.sentAt = new Date();
        alert.recipientsCount = result.successCount;
        await alert.save();

        return res.status(201).json({
          success: true,
          message: 'Alert created and sent successfully',
          data: {
            alert,
            notifications: {
              totalTokens: fcmTokens.length,
              successCount: result.successCount,
              failureCount: result.failureCount
            }
          }
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Alert created but failed to send notifications',
          error: error.message,
          data: { alert }
        });
      }
    }
  } else {
    // No location filter, send to all matching users
    const users = await User.find(query).select('fcmToken');
    const fcmTokens = users.map(user => user.fcmToken).filter(token => token);

    if (fcmTokens.length > 0) {
      try {
        const result = await sendMulticastNotification(
          fcmTokens,
          { title, body: message },
          {
            type: 'alert',
            alertId: alert._id.toString(),
            alertType: type,
            priority
          }
        );

        alert.sent = true;
        alert.sentAt = new Date();
        alert.recipientsCount = result.successCount;
        await alert.save();

        return res.status(201).json({
          success: true,
          message: 'Alert created and sent successfully',
          data: {
            alert,
            notifications: {
              totalTokens: fcmTokens.length,
              successCount: result.successCount,
              failureCount: result.failureCount
            }
          }
        });
      } catch (error) {
        return res.status(500).json({
          success: false,
          message: 'Alert created but failed to send notifications',
          error: error.message,
          data: { alert }
        });
      }
    }
  }

  // Alert created but no recipients
  res.status(201).json({
    success: true,
    message: 'Alert created but no recipients found',
    data: { alert }
  });
});

/**
 * @route   GET /api/alerts
 * @desc    Get all alerts
 * @access  Private
 */
exports.getAlerts = asyncHandler(async (req, res) => {
  const { type, priority, targetAudience, limit = 50, page = 1 } = req.query;

  const query = {};

  if (type) query.type = type;
  if (priority) query.priority = priority;
  if (targetAudience) query.targetAudience = targetAudience;

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const alerts = await Alert.find(query)
    .populate('createdBy', 'name email role')
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip(skip);

  const total = await Alert.countDocuments(query);

  res.status(200).json({
    success: true,
    data: {
      alerts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / parseInt(limit))
      }
    }
  });
});

/**
 * Helper function to calculate distance between two coordinates (Haversine formula)
 */
function calculateDistance(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in kilometers
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c; // Distance in kilometers
}
