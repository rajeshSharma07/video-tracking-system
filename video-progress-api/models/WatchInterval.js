const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const WatchedIntervalSchema = new mongoose.Schema({
  _id: {
    type: String, // Storing UUID as a string
    default: uuidv4,
    required: true,
  },
  progressId: { // This will reference the VideoProgress _id
    type: String, // Assuming VideoProgress _id is also a UUID string
    ref: 'VideoProgress', // Reference to the VideoProgress model
    required: true
  },
  startTime: {
    type: Number, // Start time in seconds
    required: [true, 'Please add a start time']
  },
  endTime: {
    type: Number, // End time in seconds
    required: [true, 'Please add an end time']
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  _id: false // Disable Mongoose's default _id, as we're using our own UUID _id
});

// Update updatedAt field on every save
WatchedIntervalSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// No direct 'belongsTo