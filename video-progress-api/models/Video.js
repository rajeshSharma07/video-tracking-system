const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid'); // To generate UUIDs if we stick to them

const VideoSchema = new mongoose.Schema({
  _id: {
    type: String, // Storing UUID as a string
    default: uuidv4, // Generate a new UUID by default
    required: true,
  },
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  url: {
    type: String,
    required: [true, 'Please add a video URL'],
    trim: true
  },
  duration: {
    type: Number, // Duration in seconds
    required: [true, 'Please add a video duration']
  },
  thumbnail: {
    type: String,
    trim: true
  },
  isPublished: {
    type: Boolean,
    default: true
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
  // Mongoose handles timestamps by default, but we can set specific field names
  timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
  _id: false // Disable Mongoose's default _id, as we're using our own UUID _id
});

// Update updatedAt field on every save
VideoSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// No direct 'hasMany' association in Mongoose like Sequelize.
// Relationships are typically handled by referencing document IDs.
// We'll manage querying video progress using videoId in controllers.

module.exports = mongoose.model('Video', VideoSchema);