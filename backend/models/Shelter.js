const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add a shelter name'],
        trim: true,
        maxlength: [50, 'Name can not be more than 50 characters']
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point'],
            required: true // verified below
        },
        coordinates: {
            type: [Number],
            required: true
        },
        formattedAddress: String,
        street: String,
        city: String,
        state: String,
        zipcode: String,
        country: String
    },
    capacity: {
        type: Number,
        required: [true, 'Please add capacity']
    },
    availableBeds: {
        type: Number,
        required: [true, 'Please add available beds number']
    },
    verified: {
        type: Boolean,
        default: false
    },
    facilities: {
        type: [String],
        default: []
    },
    contactInfo: {
        phone: String,
        email: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

shelterSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('Shelter', shelterSchema);
