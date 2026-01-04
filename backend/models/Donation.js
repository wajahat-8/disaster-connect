const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
    donorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    type: {
        type: String,
        enum: ['money', 'supplies'],
        required: true
    },
    amount: {
        type: Number,
        // Required only if type is money, but we can handle validaton in controller or here.
        // For supplies, this could represent quantity or estimated value, or be 0.
        default: 0
    },
    itemDescription: {
        type: String,
        // Required for supplies
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'],
        default: 'completed' // simulating successful payment
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
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Donation', donationSchema);
