const VideoProgress = require('../models/VideoProgress'); // Import Mongoose VideoProgress model
const Video = require('../models/Video'); // Import Mongoose Video model
const { mergeIntervals, calculateUniqueWatchedTime } = require('../utils/progressUtils');

// Get user's progress for all videos
exports.getUserProgress = async (req, res) => {
  try {
    const progress = await VideoProgress.find({ userId: req.user.id }) // Mongoose find
                                        .populate({ // Mongoose populate for associations
                                          path: 'videoId', // Name of the field in VideoProgress schema that holds the Video ID
                                          select: 'title thumbnail duration' // Fields to select from Video model
                                        });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress
    });
  } catch (error) {
    console.error('Error in getUserProgress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get user's progress for a specific video
exports.getVideoProgress = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Check if video exists
    const video = await Video.findById(videoId); // Mongoose findById
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Get or create progress record
    let progress = await VideoProgress.findOne({ // Mongoose findOne
      userId: req.user.id,
      videoId // videoId is already correctly passed as the ID
    });

    if (!progress) {
      progress = await VideoProgress.create({ // Mongoose create
        userId: req.user.id,
        videoId,
        // watchedIntervals, totalWatchedSeconds, progressPercentage, lastPosition, completed have defaults in schema
      });
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error in getVideoProgress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update progress for a video
exports.updateProgress = async (req, res) => {
  try {
    const { videoId } = req.params;
    const { currentTime, intervals } = req.body;

    // Check if video exists
    const video = await Video.findById(videoId); // Mongoose findById
    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Get or create progress record
    let progress = await VideoProgress.findOne({ // Mongoose findOne
      userId: req.user.id,
      videoId
    });

    if (!progress) {
      progress = await VideoProgress.create({ // Mongoose create
        userId: req.user.id,
        videoId,
      });
    }

    // Update watched intervals logic
    if (intervals && intervals.length > 0) {
      // Concatenate new intervals with existing ones
      let watchedIntervals = [...progress.watchedIntervals, ...intervals];

      // Convert Mongoose subdocuments to plain objects for progressUtils
      watchedIntervals = watchedIntervals.map(interval => interval.toObject ? interval.toObject() : interval);

      // Merge overlapping intervals
      watchedIntervals = mergeIntervals(watchedIntervals);

      // Calculate total unique watched time
      const totalWatchedSeconds = calculateUniqueWatchedTime(watchedIntervals);

      // Calculate progress percentage
      const progressPercentage = (totalWatchedSeconds / video.duration) * 100;

      // Check if video is completed (e.g., 95% or more watched)
      const completed = progressPercentage >= 95;

      // Update progress record
      Object.assign(progress, {
        watchedIntervals,
        totalWatchedSeconds,
        progressPercentage,
        lastPosition: currentTime || progress.lastPosition,
        completed,
        lastWatched: new Date()
      });

      await progress.save(); // Mongoose save to persist changes
    } else if (currentTime !== undefined) { // Check for undefined specifically to allow 0
      // Just update the last position
      progress.lastPosition = currentTime;
      progress.lastWatched = new Date();
      await progress.save(); // Mongoose save
    }

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error in updateProgress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reset progress for a video
exports.resetProgress = async (req, res) => {
  try {
    const { videoId } = req.params;

    // Check if progress record exists
    const progress = await VideoProgress.findOne({ // Mongoose findOne
      userId: req.user.id,
      videoId
    });

    if (!progress) {
      return res.status(404).json({ message: 'Progress record not found' });
    }

    // Reset progress
    Object.assign(progress, {
      watchedIntervals: [],
      totalWatchedSeconds: 0,
      progressPercentage: 0,
      lastPosition: 0,
      completed: false,
      lastWatched: new Date()
    });

    await progress.save(); // Mongoose save

    res.status(200).json({
      success: true,
      data: progress
    });
  } catch (error) {
    console.error('Error in resetProgress:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};