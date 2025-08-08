const mongoose = require('mongoose');

const ShelterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: String,
  capacity: Number,
  currentOccupancy: { type: Number, default: 0 },
  facilities: [String],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
  },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Shelter', ShelterSchema);
