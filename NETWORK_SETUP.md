# Network Setup Guide for Physical Device Testing

## Quick Fix for Network Errors

If you're getting network errors when connecting from your phone to the backend:

### 1. Update IP Address in Config
Your computer's IP address has been detected as: **192.168.10.6**

The config file (`frontend/config.js`) has been updated with this IP. If your IP changes, update it there.

### 2. Make Sure Backend is Running
```bash
cd backend
npm run dev
```

You should see:
```
Server running in development mode on port 5000
Accessible at: http://localhost:5000 or http://192.168.10.6:5000
```

### 3. Check Windows Firewall
Windows Firewall might be blocking port 5000. To allow it:

1. Open Windows Defender Firewall
2. Click "Advanced settings"
3. Click "Inbound Rules" → "New Rule"
4. Select "Port" → Next
5. Select "TCP" and enter port "5000"
6. Select "Allow the connection"
7. Apply to all profiles
8. Name it "Node.js Backend"

Or run this PowerShell command (as Administrator):
```powershell
New-NetFirewallRule -DisplayName "Node.js Backend" -Direction Inbound -LocalPort 5000 -Protocol TCP -Action Allow
```

### 4. Verify Both Devices on Same Network
- Both your PC and phone must be on the same Wi-Fi network
- Check your phone's Wi-Fi settings to confirm

### 5. Test Connection
From your phone's browser, try accessing:
```
http://192.168.10.6:5000
```

You should see:
```json
{
  "success": true,
  "message": "Disaster Connect API is running",
  "version": "1.0.0"
}
```

If this works, the backend is accessible. If not, check firewall settings.

### 6. Restart Expo App
After updating the config:
1. Stop the Expo server (Ctrl+C)
2. Clear cache: `npx expo start -c`
3. Reload the app on your phone

## Finding Your IP Address

If your IP changes, find it again:

**Windows:**
```bash
ipconfig | findstr /i "IPv4"
```

**Mac/Linux:**
```bash
ifconfig | grep "inet "
```

Then update `YOUR_COMPUTER_IP` in `frontend/config.js`

## Troubleshooting

### Still Getting Network Error?

1. **Check backend is running**: Look for the server console output
2. **Check IP address**: Make sure it matches in config.js
3. **Check firewall**: Port 5000 must be allowed
4. **Check network**: Both devices on same Wi-Fi
5. **Try ping**: From phone, ping your computer's IP (if ping is enabled)
6. **Check backend logs**: Look for incoming requests in the console

### Alternative: Use ngrok for Testing
If firewall issues persist, you can use ngrok to create a tunnel:

```bash
# Install ngrok
npm install -g ngrok

# Start your backend
cd backend
npm run dev

# In another terminal, create tunnel
ngrok http 5000
```

Then use the ngrok URL in your config (e.g., `https://abc123.ngrok.io/api`)

