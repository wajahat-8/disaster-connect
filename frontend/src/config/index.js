import Constants from 'expo-constants';

// Dynamically retrieve the host IP address
// This works for Expo Go (Android/iOS) and automatically picks up your PC's IP
const YOUR_COMPUTER_IP = '192.168.10.8';

export const API_BASE_URL = __DEV__
  ? `http://${YOUR_COMPUTER_IP}:5000/api`
  : 'https://your-production-api.com/api'; // Production URL

