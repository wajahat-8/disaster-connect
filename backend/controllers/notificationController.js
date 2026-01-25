const User = require('../models/User');
const Alert = require('../models/Alert');
const UserNotification = require('../models/UserNotification');
const { sendNotification: sendPushNotification, sendMulticastNotification: sendMulticastPush, sendTopicNotification: sendTopicPush } = require('../services/expoPushService');
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
 * @desc    Send notification to specific users or groups (saves to DB + sends push)
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

  let targetUsers = [];

  // Get users based on criteria
  if (userIds && userIds.length > 0) {
    targetUsers = await User.find({
      _id: { $in: userIds },
      isActive: true
    }).select('fcmToken _id');
  } else if (userRoles && userRoles.length > 0) {
    console.log(`Sending notification to roles: ${userRoles.join(', ')}`);
    targetUsers = await User.find({
      role: { $in: userRoles },
      isActive: true
    }).select('fcmToken _id');
    console.log(`Found ${targetUsers.length} target users for roles`);
  } else if (topic) {
    targetUsers = await User.find({ isActive: true }).select('fcmToken _id');
  } else {
    return res.status(400).json({
      success: false,
      message: 'Please provide userIds, userRoles, or topic'
    });
  }

  if (targetUsers.length === 0) {
    return res.status(404).json({
      success: false,
      message: 'No active users found'
    });
  }

  // Save notification to database for each user
  const notificationPromises = targetUsers.map(user =>
    UserNotification.create({
      userId: user._id,
      title,
      body,
      data: data || {},
      type: data?.type || 'general'
    })
  );

  try {
    await Promise.all(notificationPromises);
    console.log(`Saved ${targetUsers.length} notifications to database`);
  } catch (error) {
    console.error('Error saving notifications to database:', error);
  }

  // Get FCM tokens for push notification
  const fcmTokens = targetUsers
    .map(user => user.fcmToken)
    .filter(token => token && token !== '');

  // Send push notifications if tokens available
  let pushResult = { successCount: 0, failureCount: 0 };

  if (fcmTokens.length > 0) {
    try {
      pushResult = await sendMulticastPush(
        fcmTokens,
        { title, body },
        data || {}
      );
    } catch (error) {
      console.error('Error sending push notifications:', error);
    }
  }

  res.status(200).json({
    success: true,
    message: 'Notifications sent successfully',
    data: {
      totalUsers: targetUsers.length,
      savedToDb: targetUsers.length,
      pushSent: fcmTokens.length,
      successCount: pushResult.successCount,
      failureCount: pushResult.failureCount
    }
  });
});

/**
 * @route   GET /api/notifications/inbox
 * @desc    Get user's notification inbox
 * @access  Private
 */
exports.getInbox = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, filter = 'all' } = req.query;
  const userId = req.user.id;

  // Build query
  const query = { userId };
  if (filter === 'unread') {
    query.isRead = false;
  } else if (filter === 'read') {
    query.isRead = true;
  }

  const notifications = await UserNotification.find(query)
    .sort({ createdAt: -1 })
    .limit(parseInt(limit))
    .skip((parseInt(page) - 1) * parseInt(limit));

  const total = await UserNotification.countDocuments(query);
  const unreadCount = await UserNotification.countDocuments({ userId, isRead: false });

  res.status(200).json({
    success: true,
    data: {
      notifications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        totalPages: Math.ceil(total / parseInt(limit))
      },
      unreadCount
    }
  });
});

/**
 * @route   PATCH /api/notifications/:id/read
 * @desc    Mark notification as read
 * @access  Private
 */
exports.markAsRead = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const notification = await UserNotification.findOneAndUpdate(
    { _id: id, userId },
    { isRead: true, readAt: new Date() },
    { new: true }
  );

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Notification marked as read',
    data: notification
  });
});

/**
 * @route   PATCH /api/notifications/read-all
 * @desc    Mark all user's notifications as read
 * @access  Private
 */
exports.markAllAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const result = await UserNotification.updateMany(
    { userId, isRead: false },
    { isRead: true, readAt: new Date() }
  );

  res.status(200).json({
    success: true,
    message: 'All notifications marked as read',
    data: {
      modifiedCount: result.modifiedCount
    }
  });
});

/**
 * @route   GET /api/notifications/unread-count
 * @desc    Get count of unread notifications
 * @access  Private
 */
exports.getUnreadCount = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const count = await UserNotification.countDocuments({ userId, isRead: false });

  res.status(200).json({
    success: true,
    data: { unreadCount: count }
  });
});

// Create system alert (admin only)
exports.createAlert = asyncHandler(async (req, res) => {
  req.body.createdBy = req.user.id;

  const alert = await Alert.create(req.body);

  // If you want to automatically send push notifications for this alert:
  // This logic mimics sendNotification but uses the alert data
  // For now, we just create the record to fix the API crash.

  res.status(201).json({
    success: true,
    message: 'Alert created successfully',
    data: alert
  });
});

// Get all alerts
exports.getAlerts = asyncHandler(async (req, res) => {
  const alerts = await Alert.find().sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: alerts.length,
    data: alerts
  });
});

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
exports.deleteNotification = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  const notification = await UserNotification.findOneAndDelete({ _id: id, userId });

  if (!notification) {
    return res.status(404).json({
      success: false,
      message: 'Notification not found'
    });
  }

  res.status(200).json({
    success: true,
    message: 'Notification deleted',
    data: {}
  });
});
