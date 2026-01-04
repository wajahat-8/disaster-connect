# How to Test "Without APK" (Development Workflow)

You are currently confused because you think you need to rebuild/install an APK for every change. **You do not.**

There are two ways to test your Expo app without constantly building APKs:

## Option 1: Development Build (Recommended for your setup)

You have already built a "Development Build" (the APK you installed). This is a special **"Shell"** app.

1.  **Install the APK** on your phone ONE TIME.
2.  **Run the Server**: On your PC, run:
    ```powershell
    npx expo start --clear
    ```
3.  **Connect**:
    *   Open the "Development Build" app on your phone.
    *   It should detect the running server (if on same Wi-Fi).
    *   Or, scan the QR code from the terminal using your phone's Camera (or the Scan button in the app).
4.  **Edit & Update**:
    *   Change code in your editor.
    *   Save the file.
    *   The app on your phone will **automatically reload** with the new code.
    *   **NO APK RE-INSTALL NEEDED.**

**When DO you need to reinstall?**
*   ONLY if you add new **Native** libraries (rare). For 99% of changes (JS, CSS, Components), you just save and it updates.

## Option 2: Expo Go (Easiest)

If you don't even want to install the Development APK, you can use the **Expo Go** app from the Play Store.

1.  Download **Expo Go** from Play Store.
2.  Run `npx expo start --clear`.
3.  Press `s` in the terminal to switch to "Expo Go" mode (if it defaults to Development Build).
4.  Scan the QR code with Expo Go.

*Note: Expo Go might not work if you have custom native code, but your project looks compatible.*

---

## Troubleshooting "Syntax Error"

You saw a `SyntaxError` in `ShelterListScreen.js`.
*   **Good News**: I checked the file, and the code looks correct now. The error might have been from an unsaved state or cache.
*   **Action**: Run this command to clear the cache and restart:
    ```powershell
    npx expo start --clear
    ```

## Troubleshooting "Network Error"

If your phone cannot connect to `192.168.10.8:8081`:
1.  **Same Wi-Fi**: Ensure phone and PC are on the exact same network.
2.  **Firewall**: Windows Firewall often blocks port 8081.
    *   **Try Tunnel**: `npx expo start --tunnel` (If this fails with "took too long", try it again, sometimes it times out).
    *   **Allow Port**: Allow Node.js through Windows Firewall.
