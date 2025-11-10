// API Configuration for React Native
// For Android emulator, use: http://10.0.2.2:5000/api
// For iOS simulator, use: http://localhost:5000/api
// For physical device, use your computer's IP: http://YOUR_IP:5000/api

// Your computer's IP address (found via: ipconfig on Windows, ifconfig on Mac/Linux)
const YOUR_COMPUTER_IP = '192.168.10.6'; // Update this if your IP changes

export const API_BASE_URL = __DEV__ 
  ? `http://${YOUR_COMPUTER_IP}:5000/api`  // Use your computer's IP for physical device
  : 'https://your-production-api.com/api'; // Production URL

