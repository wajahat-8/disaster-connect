import React, { useEffect, useRef } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { Platform, LogBox } from 'react-native';
import Constants from 'expo-constants';
import { AuthProvider } from './src/auth'; // Updated import path
import { useAuth } from './src/auth/useAuth';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme';
import { initializeNotifications } from './src/services/notificationService';
import * as Notifications from 'expo-notifications';

// Suppress specific warnings including the Expo Go notification error
LogBox.ignoreLogs([
  'expo-notifications: Android Push notifications (remote notifications) functionality provided by expo-notifications was removed',
  'expo-notifications:', // Catch generic prefix if needed
]);

// Check if running in Expo Go with SDK 53+
const isExpoGoSDK53Plus = () => {
  const isExpoGo = Constants.appOwnership === 'expo';
  const sdkVersion = parseInt(Constants.expoConfig?.sdkVersion || Constants.manifest?.sdkVersion || '0');
  return isExpoGo && Platform.OS === 'android' && sdkVersion >= 53;
};

// Notification handler component (must be inside AuthProvider)
function NotificationHandler() {
  const { user } = useAuth();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Skip all notification setup in Expo Go SDK 53+
    if (isExpoGoSDK53Plus()) {
      console.log('expo-notifications: Skipping initialization (Expo Go SDK 53+ - use development build)');
      return;
    }

    // Initialize notifications when user is logged in
    if (user) {
      initializeNotifications().catch((error) => {
        console.log('expo-notifications: Initialization failed:', error.message);
      });
    }

    // Setup notification listeners
    try {
      notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
        console.log('Notification received:', notification);
        // Handle notification received while app is in foreground
        // You can show an alert, update UI, etc.
      });

      responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
        console.log('Notification tapped:', response);
        const data = response.notification.request.content.data;

        // Handle notification tap
        // You can navigate to specific screens based on notification data
        // Example: navigation.navigate('DisasterDetail', { id: data.disasterId });
      });
    } catch (error) {
      console.log('expo-notifications: Listener setup failed');
    }

    return () => {
      try {
        if (notificationListener.current) {
          notificationListener.current.remove();
        }
        if (responseListener.current) {
          responseListener.current.remove();
        }
      } catch (error) {
        console.log('expo-notifications: Listener cleanup skipped');
      }
    };
  }, [user]);

  return null;
}

function AppContent() {
  return (
    <>
      <NotificationHandler />
      <AppNavigator />
    </>
  );
}

export default function App() {


  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PaperProvider>
  );
}
