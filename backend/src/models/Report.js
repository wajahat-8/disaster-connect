const mongoose = require('mongoose');

const ReportSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: { type: String, enum: ['flood','fire','earthquake','other'], required: true },
  severity: { type: String, enum: ['low','medium','high'], default: 'low' },
  images: [String],
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], index: '2dsphere' } // [lng, lat]
  },
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: { type: String, enum: ['pending','verified','rejected'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Report', ReportSchema);
