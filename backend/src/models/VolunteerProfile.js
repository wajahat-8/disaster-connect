const mongoose = require('mongoose');

const VolunteerSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', unique: true },
  skills: [String],
  availability: { type: String, enum: ['available','unavailable'], default: 'available' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number] } // [lng, lat]
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('VolunteerProfile', VolunteerSchema);
