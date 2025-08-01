const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

// Define a sub-schema for the watched intervals
const IntervalSchema = new mongoose.Schema({
  start: { type: Number, required: true },
  end: { type: Number, required: true }
}, { _id: false }); // No _id needed for sub-documents

const VideoProgressSchema = new mongoose.Schema({
  _id: {
    type: String, // Storing UUID as a string
    default: uuidv4,
    required: true,
  },
  userId: {
    type: String, // Assuming User _id is also a UUID string
    ref: 'User', // Reference to the User model
    required: true
  },
  videoId: {
    type: String, // Assuming Video _id is also a UUID string
    ref: 'Video', // Reference to the Video model
    required: true
  },
  watchedIntervals: {
    type: [IntervalSchema], // Array of embedded IntervalSchema documents
    default: []
  },
  totalWatchedSeconds: {
    type: Number,
    default: 0
  },
  progressPercentage: {
    type: Number,
    default: 0
  },
  lastPosition: {
    type: Number, // Last position in seconds
    default: 0
  },
  completed: {
    type: Boolean,
    default: false
  },
  lastWatched: {
    type: Date,
    default: Date.now
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
VideoProgressSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Ensure a unique combination of userId and videoId
VideoProgressSchema.index({ userId: 1, videoId: 1 }, { unique: true });

module.exports = mongoose.model('VideoProgress', VideoProgressSchema);