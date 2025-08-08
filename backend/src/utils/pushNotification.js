// Minimal FCM push helper using node-fetch.
// You can call sendToToken or sendToTokens with payload.
const fetch = require('node-fetch');

const FCM_URL = 'https://fcm.googleapis.com/fcm/send';
const SERVER_KEY = process.env.FCM_SERVER_KEY;

async function sendToToken(token, title, body, data = {}) {
  if (!SERVER_KEY) {
    console.warn('FCM_SERVER_KEY not set — cannot send push');
    return null;
  }
  const payload = {
    to: token,
    notification: { title, body },
    data
  };
  const res = await fetch(FCM_URL, {
    method: 'POST',
    headers: {
      Authorization: `key=${SERVER_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  return res.json();
}

async function sendToTokens(tokens, title, body, data = {}) {
  if (!SERVER_KEY) return null;
  const payload = {
    registration_ids: tokens,
    notification: { title, body },
    data
  };
  const res = await fetch(FCM_URL, {
    method: 'POST',
    headers: {
      Authorization: `key=${SERVER_KEY}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });
  return res.json();
}

module.exports = { sendToToken, sendToTokens };
