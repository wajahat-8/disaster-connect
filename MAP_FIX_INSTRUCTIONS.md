# Fix Blank/Beige Map Issue

The blank/beige map you're seeing is a **Google Maps API key configuration issue**. The map component is working, but the tiles aren't loading because of API key restrictions.

## Quick Fix (5 minutes)

### Step 1: Enable Maps SDK in Google Cloud Console

1. Go to [Google Cloud Console - APIs & Services](https://console.cloud.google.com/apis/library)
2. Search for **"Maps SDK for Android"**
3. Click on it and press **"ENABLE"**
4. Also enable **"Maps SDK for iOS"** if you plan to test on iOS

### Step 2: Fix API Key Restrictions

1. Go to [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2. Find your API key: `AIzaSyDE_1o0p0aJ_IYdxs8gPgG1skYCi9VKrl4`
3. Click the **pencil icon** (Edit)
4. Scroll to **"API restrictions"**
   - Select **"Restrict key"**
   - Check **"Maps SDK for Android"**
   - Check **"Maps SDK for iOS"** (if needed)
5. Scroll to **"Application restrictions"**
   - **Option A (Quick Fix for Testing):** Select **"None"** - This allows any app to use the key
   - **Option B (Secure):** Select **"Android apps"** and add:
     - Package name: `com.disasterconnect.app`
     - SHA-1 fingerprint: (Get it using steps below)
6. Click **"SAVE"**

### Step 3: Get SHA-1 Fingerprint (For Secure Option)

Run this command in your terminal:

```powershell
cd frontend
npx eas credentials
```

Then:
1. Select **Android** > **development** > **Keystore**
2. Copy the **SHA-1 Fingerprint** (looks like: `AB:CD:12:34:...`)
3. Add it to Google Cloud Console as described in Step 2

### Step 4: Rebuild Your App

After making changes in Google Cloud Console:

```powershell
cd frontend
npx expo prebuild --clean
npx expo run:android
```

**Important:** Wait 2-5 minutes after saving changes in Google Cloud Console before testing, as changes can take time to propagate.

## Verify API Key is Working

1. Check that **Maps SDK for Android** is enabled
2. Check that your API key has **no restrictions** (for testing) OR has the correct **SHA-1 fingerprint**
3. Rebuild the app completely (clean build)

## Common Issues

- **Still blank after fix?** Wait 5 minutes and try again - Google's changes take time to propagate
- **"API key not valid" error?** Make sure Maps SDK for Android is enabled
- **Works in emulator but not device?** Different SHA-1 fingerprints - add both debug and release fingerprints

## Current Configuration

Your app is configured with:
- ✅ `react-native-maps` v1.20.1
- ✅ `PROVIDER_GOOGLE` for Android
- ✅ API key in `app.json`: `AIzaSyDE_1o0p0aJ_IYdxs8gPgG1skYCi9VKrl4`
- ✅ Package name: `com.disasterconnect.app`

The issue is **100% in Google Cloud Console settings**, not your code!


