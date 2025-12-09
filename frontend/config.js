import Constants from 'expo-constants';

// Dynamically retrieve the host IP address
// This works for Expo Go (Android/iOS) and automatically picks up your PC's IP
const debuggerHost = Constants.expoConfig?.hostUri || Constants.manifest2?.extra?.expoGo?.debuggerHost || Constants.manifest?.debuggerHost || 'localhost';
const localhost = debuggerHost.split(':')[0];

// Use the detected IP for mobile, or falling back to localhost
const YOUR_COMPUTER_IP = localhost || 'localhost';

export const API_BASE_URL = __DEV__
  ? `http://${YOUR_COMPUTER_IP}:5000/api`
  : 'https://your-production-api.com/api'; // Production URL

