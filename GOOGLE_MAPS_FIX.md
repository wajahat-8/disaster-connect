# How to Fix the "Beige Map" (Google Cloud Console)

Since I cannot log into your private Google account, you must perform these few clicks. This is the **Result 100% Fix**.

## Option A: The "Instant Fix" (Recommended for now)

This removes the security checks temporarily so the map works **immediately** while you develop.

1.  **Click this link**: [Google Cloud Console - Credentials](https://console.cloud.google.com/apis/credentials)
2.  Look for your API Key (It starts with `AIzaSyDE...`).
3.  Click the **Pencil Icon** (Edit).
4.  Scroll down to **"Application restrictions"**.
5.  Select **"None"**.
    *   *(This allows ANY app to use this key. It is fine for testing).*
6.  Click **SAVE**.
7.  **Restart your App**. The map will appear instantly.

---

## Option B: The "Secure Fix" (Add Fingerprint)

If you want to keep restrictions on, you need to add the "Fingerprint" of your new APK.

1.  Run this command in your computer terminal:
    ```powershell
    npx eas credentials
    ```
2.  Select **Android** > **development** > **Keystore**.
3.  Look for **SHA-1 Fingerprint**. It looks like `AB:CD:12:34:...`.
4.  Copy it.
5.  Go to the [Google Cloud Console](https://console.cloud.google.com/apis/credentials) > Edit API Key.
6.  Under **"Android apps"**, click **"ADD AN ITEM"**.
7.  **Package name**: `com.disasterconnect.app`
8.  **SHA-1**: Paste the code you copied.
9.  Click **SAVE**.

**I recommend Option A right now so you can get back to coding.**
