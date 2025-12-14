import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import apiClient from '../auth/apiClient';

// Get Expo project ID from constants
const getExpoProjectId = () => {
  return Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.manifest2?.extra?.eas?.projectId ||
    Constants.manifest?.extra?.eas?.projectId ||
    undefined;
};

// Configure how notifications are handled when app is in foreground
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

/**
 * Request notification permissions
 * @returns {Promise<boolean>} True if permission granted, false otherwise
 */
export const requestNotificationPermission = async () => {
  try {
    // Check if device is physical device (notifications don't work on simulators)
    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return false;
    }

    // Check existing permission status
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Request permission if not already granted
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.warn('Failed to get push token for push notification!');
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error requesting notification permission:', error);
    return false;
  }
};

/**
 * Get FCM/Expo push token
 * @returns {Promise<string|null>} Push token or null if not available
 */
export const getPushToken = async () => {
  try {
    if (!Device.isDevice) {
      console.warn('Must use physical device for Push Notifications');
      return null;
    }

    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
      console.warn('Notification permission not granted');
      return null;
    }

    const projectId = getExpoProjectId();
    const tokenConfig = projectId ? { projectId } : {};
    const tokenData = await Notifications.getExpoPushTokenAsync(tokenConfig);

    return tokenData.data;
  } catch (error) {
    console.error('Error getting push token:', error);
    return null;
  }
};

/**
 * Register FCM token with backend
 * @param {string} token - FCM/Expo push token
 * @returns {Promise<boolean>} True if registration successful
 */
export const registerTokenWithBackend = async (token) => {
  try {
    if (!token) {
      console.warn('No token to register');
      return false;
    }

    const response = await apiClient.post('/notifications/register', {
      fcmToken: token,
    });

    if (response.data.success) {
      console.log('Token registered with backend successfully');
      return true;
    }

    return false;
  } catch (error) {
    console.error('Error registering token with backend:', error);
    return false;
  }
};

/**
 * Initialize notification system
 * Requests permission and registers token with backend
 * @returns {Promise<boolean>} True if initialization successful
 */
export const initializeNotifications = async () => {
  try {
    // Create android notification channel
    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('emergency_alerts', {
        name: 'Emergency Alerts',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });

      await Notifications.setNotificationChannelAsync('task_alerts', {
        name: 'Task Alerts',
        importance: Notifications.AndroidImportance.HIGH,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    // Request permission
    const permissionGranted = await requestNotificationPermission();
    if (!permissionGranted) {
      return false;
    }

    // Get token
    const token = await getPushToken();
    if (!token) {
      return false;
    }

    // Register with backend
    const registered = await registerTokenWithBackend(token);
    return registered;
  } catch (error) {
    console.error('Error initializing notifications:', error);
    return false;
  }
};

/**
 * Setup notification listeners
 * @param {Function} onNotificationReceived - Callback when notification is received
 * @param {Function} onNotificationTapped - Callback when notification is tapped
 * @returns {Array} Array of subscription objects (for cleanup)
 */
export const setupNotificationListeners = (
  onNotificationReceived = null,
  onNotificationTapped = null
) => {
  const subscriptions = [];

  // Listener for notifications received while app is foregrounded
  if (onNotificationReceived) {
    const subscription = Notifications.addNotificationReceivedListener((notification) => {
      onNotificationReceived(notification);
    });
    subscriptions.push(subscription);
  }

  // Listener for when user taps on or interacts with a notification
  if (onNotificationTapped) {
    const subscription = Notifications.addNotificationResponseReceivedListener((response) => {
      onNotificationTapped(response);
    });
    subscriptions.push(subscription);
  }

  return subscriptions;
};

/**
 * Cancel all local notifications
 */
export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

/**
 * Get notification badge count
 */
export const getBadgeCount = async () => {
  return await Notifications.getBadgeCountAsync();
};

/**
 * Set notification badge count
 */
export const setBadgeCount = async (count) => {
  await Notifications.setBadgeCountAsync(count);
};

export default {
  requestNotificationPermission,
  getPushToken,
  registerTokenWithBackend,
  initializeNotifications,
  setupNotificationListeners,
  cancelAllNotifications,
  getBadgeCount,
  setBadgeCount,
};
