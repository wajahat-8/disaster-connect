const { Expo } = require('expo-server-sdk');

// Create a new Expo SDK client
const expo = new Expo();

/**
 * Send notification to a single device
 * @param {string} expoPushToken - Expo push token
 * @param {object} notification - Notification payload with title and body
 * @param {object} data - Additional data payload
 * @returns {Promise<{success: boolean, messageId?: string, error?: string}>}
 */
exports.sendNotification = async (expoPushToken, notification, data = {}) => {
    try {
        // Check that the token is a valid Expo push token
        if (!Expo.isExpoPushToken(expoPushToken)) {
            console.error(`Push token ${expoPushToken} is not a valid Expo push token`);
            return {
                success: false,
                error: 'Invalid Expo push token'
            };
        }

        // Construct the message
        const message = {
            to: expoPushToken,
            sound: 'default',
            title: notification.title || 'Disaster Connect',
            body: notification.body || '',
            data: data || {},
            priority: 'high',
            channelId: 'emergency_alerts',
        };

        // Send the notification
        const ticketChunk = await expo.sendPushNotificationsAsync([message]);
        const ticket = ticketChunk[0];

        if (ticket.status === 'error') {
            console.error('Error sending notification:', ticket.message);
            return {
                success: false,
                error: ticket.message
            };
        }

        console.log('Successfully sent notification:', ticket.id);
        return {
            success: true,
            messageId: ticket.id
        };
    } catch (error) {
        console.error('Error sending notification:', error);
        return {
            success: false,
            error: error.message
        };
    }
};

/**
 * Send notification to multiple devices
 * @param {string[]} expoPushTokens - Array of Expo push tokens
 * @param {object} notification - Notification payload with title and body
 * @param {object} data - Additional data payload
 * @returns {Promise<{success: boolean, successCount: number, failureCount: number, responses?: array}>}
 */
exports.sendMulticastNotification = async (expoPushTokens, notification, data = {}) => {
    try {
        if (!expoPushTokens || expoPushTokens.length === 0) {
            return {
                success: false,
                successCount: 0,
                failureCount: 0,
                message: 'No push tokens provided'
            };
        }

        // Filter out invalid tokens
        const validTokens = expoPushTokens.filter(token => Expo.isExpoPushToken(token));

        if (validTokens.length === 0) {
            return {
                success: false,
                successCount: 0,
                failureCount: expoPushTokens.length,
                message: 'No valid Expo push tokens'
            };
        }

        // Create messages
        const messages = validTokens.map(token => ({
            to: token,
            sound: 'default',
            title: notification.title || 'Disaster Connect',
            body: notification.body || '',
            data: data || {},
            priority: 'high',
            channelId: 'emergency_alerts',
        }));

        // Expo recommends batching notifications in chunks of 100
        const chunks = expo.chunkPushNotifications(messages);
        const tickets = [];

        // Send each chunk
        for (const chunk of chunks) {
            try {
                const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
                tickets.push(...ticketChunk);
            } catch (error) {
                console.error('Error sending chunk:', error);
                // Add error tickets for failed chunk
                tickets.push(...chunk.map(() => ({ status: 'error', message: error.message })));
            }
        }

        // Count successes and failures
        const successCount = tickets.filter(ticket => ticket.status === 'ok').length;
        const failureCount = tickets.filter(ticket => ticket.status === 'error').length;

        console.log(`Sent ${successCount} notifications successfully, ${failureCount} failed`);

        return {
            success: true,
            successCount,
            failureCount,
            responses: tickets
        };
    } catch (error) {
        console.error('Error sending multicast notification:', error);
        return {
            success: false,
            successCount: 0,
            failureCount: expoPushTokens.length,
            error: error.message
        };
    }
};

/**
 * Send notification to a topic (simulated with user roles)
 * Note: Expo doesn't have native topic support, so this is a wrapper
 * that expects the caller to provide the list of tokens
 * @param {string[]} expoPushTokens - Array of tokens for the "topic"
 * @param {object} notification - Notification payload
 * @param {object} data - Additional data payload
 * @returns {Promise}
 */
exports.sendTopicNotification = async (expoPushTokens, notification, data = {}) => {
    // Topic notifications are just multicast in Expo
    return exports.sendMulticastNotification(expoPushTokens, notification, data);
};

/**
 * Validate Expo push token
 * @param {string} token - Token to validate
 * @returns {boolean}
 */
exports.isValidExpoPushToken = (token) => {
    return Expo.isExpoPushToken(token);
};

module.exports = exports;
