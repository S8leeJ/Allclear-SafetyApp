const mongoose = require('mongoose');

const friendSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  username: {
    type: String,
    required: [true, 'Username is required'],
    trim: true,
    maxlength: [50, 'Username cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  location: {
    lat: {
      type: Number,
      required: [true, 'Latitude is required'],
      min: [-90, 'Latitude must be between -90 and 90'],
      max: [90, 'Latitude must be between -90 and 90']
    },
    lng: {
      type: Number,
      required: [true, 'Longitude is required'],
      min: [-180, 'Longitude must be between -180 and 180'],
      max: [180, 'Longitude must be between -180 and 180']
    }
  },
  status: {
    type: String,
    enum: ['Safe', 'In Risk Zone', 'Unknown', 'Emergency'],
    default: 'Unknown'
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for better query performance
friendSchema.index({ userId: 1, email: 1 });

// Instance method to get friend data for map
friendSchema.methods.toMapJSON = function() {
  return {
    id: this._id,
    name: this.username,
    status: this.status,
    lat: this.location.lat,
    lng: this.location.lng,
    lastUpdated: this.lastUpdated
  };
};

// Static method to find friends by user ID
friendSchema.statics.findByUserId = function(userId) {
  return this.find({ userId, isActive: true }).sort({ createdAt: -1 });
};

// Static method to check if friend exists for user
friendSchema.statics.existsForUser = function(userId, email) {
  return this.exists({ userId, email, isActive: true });
};

module.exports = mongoose.model('Friend', friendSchema); 