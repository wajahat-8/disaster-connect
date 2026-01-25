import Constants from 'expo-constants';
import { Platform } from 'react-native';

/**
 * Automatically detects the host IP address from Expo's development server
 * This eliminates the need to manually update the IP when your network changes
 */
const getHostIP = () => {
  // For web platform, use localhost
  if (Platform.OS === 'web') {
    return 'localhost';
  }

  // Expo provides the host IP automatically in development mode
  // This extracts the IP from the debuggerHost (format: "192.168.x.x:8081")
  const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest?.debuggerHost;

  if (debuggerHost) {
    // Extract just the IP address (remove port if present)
    const host = debuggerHost.split(':')[0];
    return host;
  }

  // Fallback: If auto-detection fails, use a default
  // You can manually override this in rare cases
  console.warn('Could not auto-detect host IP, using fallback');
  return '192.168.10.6'; // Fallback IP updated to match server logs
};

const HOST_IP = getHostIP();

export const API_BASE_URL = __DEV__
  ? `http://${HOST_IP}:5000/api`
  : 'https://your-production-api.com/api'; // Update this with your production API URL

// Log the API URL in development for debugging
if (__DEV__) {
  console.log('🌐 API Base URL:', API_BASE_URL);
}

