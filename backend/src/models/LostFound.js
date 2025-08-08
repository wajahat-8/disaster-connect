const mongoose = require('mongoose');

const LostFoundSchema = new mongoose.Schema({
  type: { type: String, enum: ['lost','found'], required: true },
  title: String,
  description: String,
  image: String,
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number] } // [lng, lat]
  },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  matchedWith: { type: mongoose.Schema.Types.ObjectId, ref: 'LostFound' },
  status: { type: String, enum: ['open','matched','closed'], default: 'open' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('LostFound', LostFoundSchema);
