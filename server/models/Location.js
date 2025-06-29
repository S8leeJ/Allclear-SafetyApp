const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    enum: ['Home', 'Work', 'School', 'Hospital', 'Police Station', 'Fire Station', 'Shelter', 'Gas Station', 'Grocery Store', 'Pharmacy', 'Bank', 'Other'],
    default: 'Other'
  },
  location: {
    lat: {
      type: Number,
      required: true,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      required: true,
      min: -180,
      max: 180
    }
  },
  description: {
    type: String,
    trim: true,
    default: ''
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
locationSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to convert to map-friendly format
locationSchema.methods.toMapJSON = function() {
  return {
    id: this._id,
    name: this.name,
    type: this.type,
    lat: this.location.lat,
    lng: this.location.lng,
    description: this.description,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt
  };
};

module.exports = mongoose.model('Location', locationSchema); 