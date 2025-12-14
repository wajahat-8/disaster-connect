# Notification System Setup Guide

This guide will help you set up Firebase Cloud Messaging (FCM) for the Disaster Connect notification system.

## Backend Setup

### 1. Firebase Project Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select an existing one
3. Enable **Cloud Messaging** in the Firebase Console
4. Go to Project Settings → Service Accounts
5. Click "Generate New Private Key" to download your service account JSON file

### 2. Backend Environment Variables

Add the following to your `backend/.env` file:

**Option 1: Service Account JSON File (Recommended for Development)**
```env
FIREBASE_SERVICE_ACCOUNT=./path/to/your-service-account-key.json
```

**Option 2: Environment Variables (Recommended for Production)**
```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_CLIENT_EMAIL=your-service-account@your-project.iam.gserviceaccount.com
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourPrivateKeyHere\n-----END PRIVATE KEY-----\n"
```

**Note:** When using `FIREBASE_PRIVATE_KEY`, make sure to include the `\n` characters or the actual newlines. The service will automatically handle the conversion.

### 3. Install Backend Dependencies

Dependencies are already installed, but if needed:
```bash
cd backend
npm install firebase-admin
```

### 4. Backend API Endpoints

The following endpoints are now available:

#### Register FCM Token (User)
```
POST /api/notifications/register
Headers: Authorization: Bearer <token>
Body: { "fcmToken": "your-fcm-token" }
```

#### Send Notification (Admin Only)
```
POST /api/notifications/send
Headers: Authorization: Bearer <admin-token>
Body: {
  "userIds": ["user-id-1", "user-id-2"],  // Optional: specific users
  "userRoles": ["volunteer", "user"],      // Optional: roles
  "topic": "emergency-alerts",             // Optional: topic
  "title": "Alert Title",
  "body": "Alert message",
  "data": { "key": "value" }              // Optional: additional data
}
```

#### Create and Send Alert (Admin Only)
```
POST /api/alerts
Headers: Authorization: Bearer <admin-token>
Body: {
  "title": "Emergency Alert",
  "message": "This is an emergency notification",
  "type": "emergency",                    // emergency, warning, info, task
  "priority": "high",                     // low, medium, high, critical
  "targetAudience": "all",                // all, users, volunteers, admins
  "location": {                           // Optional: location-based alerts
    "coordinates": [longitude, latitude],
    "radius": 10                          // in kilometers
  },
  "metadata": {}                          // Optional: additional metadata
}
```

#### Get Alerts
```
GET /api/alerts?type=emergency&priority=high&page=1&limit=20
Headers: Authorization: Bearer <token>
```

## Frontend Setup

### 1. Install Frontend Dependencies

Dependencies are already installed:
- `expo-notifications`
- `expo-device`

### 2. Important Note: Expo Push Tokens vs FCM Tokens

**Current Implementation (Expo Managed Workflow):**
- Uses `expo-notifications` which provides **Expo Push Tokens**
- These tokens start with `ExponentPushToken[...]`
- For full FCM integration, you need a development build with `@react-native-firebase/messaging`

**For Development/Testing:**
- The current setup works with Expo Go and development builds
- Tokens are registered as "Expo Push Tokens" but stored in the database as FCM tokens
- Backend is FCM-ready for when you migrate to a production build with native Firebase

**For Production with Full FCM:**
- Create a development build: `npx expo run:android` or `npx expo run:ios`
- Install `@react-native-firebase/messaging`
- Replace `expo-notifications` token retrieval with Firebase messaging token
- Backend FCM service will work directly with native FCM tokens

### 3. Firebase Configuration (For Expo)

For **Expo Go** (Development):
- The notification system will work with Expo Push Notifications
- No additional Firebase configuration needed in the app

For **Development Build / Production** (Full FCM):
1. Create `google-services.json` for Android (download from Firebase Console)
2. Place it in `frontend/google-services.json` (already configured in app.json)
3. For iOS, download `GoogleService-Info.plist` and configure in Xcode

### 3. Expo Project ID (Optional)

If you're using EAS (Expo Application Services), add your project ID to `app.json`:

```json
{
  "expo": {
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

Or get it from your `app.config.js` / `eas.json` if you have one.

### 4. Notification Permissions

The app will automatically request notification permissions on startup. The permissions are configured in `app.json`.

## Testing

### 1. Test Token Registration

1. Login to the app
2. Check console logs for "Token registered with backend successfully"
3. Verify in database that user's `fcmToken` field is populated

### 2. Test Notification Sending (Admin)

Using a REST client (like Postman) or curl:

```bash
# Login as admin first to get token
POST http://localhost:5000/api/auth/login
{
  "email": "admin@example.com",
  "password": "admin-password"
}

# Send notification
POST http://localhost:5000/api/notifications/send
Headers: Authorization: Bearer <admin-token>
{
  "userRoles": ["user"],
  "title": "Test Notification",
  "body": "This is a test notification",
  "data": {
    "type": "test"
  }
}
```

### 3. Test Alert Creation (Admin)

```bash
POST http://localhost:5000/api/alerts
Headers: Authorization: Bearer <admin-token>
{
  "title": "Emergency Alert",
  "message": "This is an emergency notification",
  "type": "emergency",
  "priority": "high",
  "targetAudience": "all"
}
```

## Notification Handling

### Receiving Notifications

The app automatically handles notifications:
- **Foreground**: Notifications are shown as alerts
- **Background**: Notifications appear in system notification tray
- **Tapped**: Notification tap handlers can navigate to specific screens

### Custom Notification Handling

Edit `frontend/App.js` to customize notification handling:

```javascript
// Handle notification received
notificationListener.current = Notifications.addNotificationReceivedListener((notification) => {
  // Custom logic here
  const data = notification.request.content.data;
  // Navigate, update UI, etc.
});

// Handle notification tap
responseListener.current = Notifications.addNotificationResponseReceivedListener((response) => {
  const data = response.notification.request.content.data;
  // Navigate based on notification type
  if (data.type === 'alert') {
    // Navigate to alert detail
  }
});
```

## Troubleshooting

### Backend Issues

1. **Firebase Admin not initialized**
   - Check your `.env` file has correct Firebase credentials
   - Verify service account JSON file path is correct
   - Check console logs for initialization errors

2. **Notification sending fails**
   - Verify FCM tokens are registered in database
   - Check Firebase Console for service account permissions
   - Ensure Cloud Messaging API is enabled

### Frontend Issues

1. **Permission denied**
   - Check device settings → Apps → Disaster Connect → Notifications
   - Ensure you're testing on a physical device (notifications don't work on simulators)

2. **Token not registering**
   - Check network connectivity
   - Verify user is logged in (token registration requires auth)
   - Check backend logs for registration errors

3. **Notifications not received**
   - Verify token is registered in backend
   - Check notification permissions are granted
   - For Expo Go, ensure you're using Expo Push Notifications
   - For production builds, verify Firebase configuration files are present

## Production Considerations

1. **Security**
   - Never commit service account keys to version control
   - Use environment variables in production
   - Rotate keys periodically

2. **Performance**
   - Batch notifications when sending to many users
   - Use topics for broadcast notifications
   - Implement rate limiting

3. **Monitoring**
   - Monitor Firebase Console for delivery statistics
   - Track notification open rates
   - Log notification failures

## Additional Resources

- [Firebase Cloud Messaging Documentation](https://firebase.google.com/docs/cloud-messaging)
- [Expo Notifications Documentation](https://docs.expo.dev/versions/latest/sdk/notifications/)
- [Firebase Admin SDK Documentation](https://firebase.google.com/docs/admin/setup)
