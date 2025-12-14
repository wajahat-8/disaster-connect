import React, { useEffect, useRef } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { AuthProvider } from './src/auth'; // Updated import path
import { useAuth } from './src/auth/useAuth';
import AppNavigator from './src/navigation/AppNavigator';
import { theme } from './src/theme';
import { initializeNotifications } from './src/services/notificationService';
import * as Notifications from 'expo-notifications';

// Notification handler component (must be inside AuthProvider)
function NotificationHandler() {
  const { user } = useAuth();
  const notificationListener = useRef();
  const responseListener = useRef();

  useEffect(() => {
    // Initialize notifications when user is logged in
    if (user) {
      initializeNotifications().catch((error) => {
        console.error('Failed to initialize notifications:', error);
      });
    }

    // Setup notification listeners
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

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
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
  useEffect(() => {
    // Request notification permission on app startup
    initializeNotifications().catch((error) => {
      console.error('Failed to initialize notifications on startup:', error);
    });
  }, []);

  return (
    <PaperProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </PaperProvider>
  );
}
