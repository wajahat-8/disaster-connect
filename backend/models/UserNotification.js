const mongoose = require('mongoose');

const userNotificationSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    data: {
        type: Object,
        default: {}
    },
    type: {
        type: String,
        enum: ['alert', 'disaster', 'general', 'task'],
        default: 'general'
    },
    isRead: {
        type: Boolean,
        default: false,
        index: true
    },
    readAt: {
        type: Date
    },
    // Reference to original alert if applicable
    alertId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alert'
    }
}, {
    timestamps: true
});

// Index for efficient queries
userNotificationSchema.index({ userId: 1, isRead: 1, createdAt: -1 });
userNotificationSchema.index({ createdAt: 1 }); // For cleanup

module.exports = mongoose.model('UserNotification', userNotificationSchema);
