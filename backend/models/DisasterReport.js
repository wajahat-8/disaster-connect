const mongoose = require('mongoose');

const disasterReportSchema = new mongoose.Schema({
  type: {
    type: String,
    required: [true, 'Disaster type is required'],
    enum: ['flood', 'earthquake', 'fire', 'storm', 'landslide', 'other'],
    lowercase: true
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [1000, 'Description cannot exceed 1000 characters']
  },
  severity: {
    type: String,
    required: [true, 'Severity is required'],
    enum: ['low', 'medium', 'high', 'critical'],
    default: 'medium'
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point'
    },
    coordinates: {
      type: [Number], // [longitude, latitude]
      required: [true, 'Coordinates are required'],
      validate: {
        validator: function(v) {
          return v.length === 2 && v[0] >= -180 && v[0] <= 180 && v[1] >= -90 && v[1] <= 90;
        },
        message: 'Invalid coordinates'
      }
    },
    address: {
      type: String,
      default: ''
    }
  },
  image: {
    type: String, // URL or path to image
    default: ''
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  verified: {
    type: Boolean,
    default: false
  },
  verifiedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  verifiedAt: {
    type: Date
  },
  status: {
    type: String,
    enum: ['reported', 'verified', 'in-progress', 'resolved', 'false-alarm'],
    default: 'reported'
  }
}, {
  timestamps: true
});

// Index for geospatial queries
disasterReportSchema.index({ location: '2dsphere' });
disasterReportSchema.index({ type: 1 });
disasterReportSchema.index({ status: 1 });
disasterReportSchema.index({ createdAt: -1 });

module.exports = mongoose.model('DisasterReport', disasterReportSchema);

