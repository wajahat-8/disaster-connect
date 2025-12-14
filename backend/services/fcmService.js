const admin = require('firebase-admin');

// Initialize Firebase Admin SDK
// Note: For production, use a service account JSON file
// For now, we'll use environment variables
let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  // If service account JSON is provided as environment variable (base64 encoded or direct JSON)
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } catch (error) {
    // If not JSON, try to load from file path
    serviceAccount = require(process.env.FIREBASE_SERVICE_ACCOUNT);
  }
} else if (process.env.FIREBASE_PROJECT_ID) {
  // Initialize with project ID and credentials from environment
  serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
  };
}

if (serviceAccount) {
  try {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    console.log('Firebase Admin initialized successfully');
  } catch (error) {
    console.error('Firebase Admin initialization error:', error.message);
  }
} else {
  console.warn('Firebase Admin not initialized: Missing service account configuration');
}

/**
 * Send notification to a single device
 * @param {string} fcmToken - FCM token of the device
 * @param {object} notification - Notification payload
 * @param {object} data - Additional data payload
 * @returns {Promise}
 */
exports.sendNotification = async (fcmToken, notification, data = {}) => {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin not initialized. Please configure FIREBASE_SERVICE_ACCOUNT.');
  }

  const message = {
    token: fcmToken,
    notification: {
      title: notification.title || 'Disaster Connect',
      body: notification.body || '',
    },
    data: {
      ...data,
      // Convert data values to strings (FCM requirement)
      ...Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      }, {})
    },
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'emergency_alerts',
        priority: 'high'
      }
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
          priority: 10
        }
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent notification:', response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('Error sending notification:', error);
    throw error;
  }
};

/**
 * Send notification to multiple devices
 * @param {string[]} fcmTokens - Array of FCM tokens
 * @param {object} notification - Notification payload
 * @param {object} data - Additional data payload
 * @returns {Promise}
 */
exports.sendMulticastNotification = async (fcmTokens, notification, data = {}) => {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin not initialized. Please configure FIREBASE_SERVICE_ACCOUNT.');
  }

  if (!fcmTokens || fcmTokens.length === 0) {
    return { success: false, message: 'No FCM tokens provided' };
  }

  const message = {
    notification: {
      title: notification.title || 'Disaster Connect',
      body: notification.body || '',
    },
    data: {
      ...data,
      // Convert data values to strings (FCM requirement)
      ...Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      }, {})
    },
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'emergency_alerts',
        priority: 'high'
      }
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
          priority: 10
        }
      }
    },
    tokens: fcmTokens
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    console.log(`Successfully sent ${response.successCount} notifications`);
    console.log(`Failed to send ${response.failureCount} notifications`);
    
    return {
      success: true,
      successCount: response.successCount,
      failureCount: response.failureCount,
      responses: response.responses
    };
  } catch (error) {
    console.error('Error sending multicast notification:', error);
    throw error;
  }
};

/**
 * Send notification to a topic
 * @param {string} topic - Topic name
 * @param {object} notification - Notification payload
 * @param {object} data - Additional data payload
 * @returns {Promise}
 */
exports.sendTopicNotification = async (topic, notification, data = {}) => {
  if (!admin.apps.length) {
    throw new Error('Firebase Admin not initialized. Please configure FIREBASE_SERVICE_ACCOUNT.');
  }

  const message = {
    topic: topic,
    notification: {
      title: notification.title || 'Disaster Connect',
      body: notification.body || '',
    },
    data: {
      ...data,
      ...Object.keys(data).reduce((acc, key) => {
        acc[key] = String(data[key]);
        return acc;
      }, {})
    },
    android: {
      priority: 'high',
      notification: {
        sound: 'default',
        channelId: 'emergency_alerts',
        priority: 'high'
      }
    },
    apns: {
      payload: {
        aps: {
          sound: 'default',
          badge: 1,
          priority: 10
        }
      }
    }
  };

  try {
    const response = await admin.messaging().send(message);
    console.log('Successfully sent topic notification:', response);
    return { success: true, messageId: response };
  } catch (error) {
    console.error('Error sending topic notification:', error);
    throw error;
  }
};
