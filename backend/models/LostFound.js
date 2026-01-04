const mongoose = require('mongoose');

const lostFoundSchema = new mongoose.Schema({
    itemName: {
        type: String,
        required: [true, 'Please add an item name']
    },
    description: {
        type: String,
        required: [true, 'Please add a description']
    },
    image: {
        type: String,
        default: 'no-photo.jpg'
    },
    location: {
        type: {
            type: String,
            enum: ['Point'],
            default: 'Point'
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        },
        address: String
    },
    status: {
        type: String,
        enum: ['lost', 'found', 'resolved'],
        required: true
    },
    reporterId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    contactInfo: {
        phone: String,
        email: String
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('LostFound', lostFoundSchema);
