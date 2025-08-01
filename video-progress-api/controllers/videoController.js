const Video = require('../models/Video'); // Import Mongoose Video model directly
const VideoProgress = require('../models/VideoProgress'); // Import Mongoose VideoProgress model

// Get all videos
exports.getAllVideos = async (req, res) => {
  try {
    const videos = await Video.find({ isPublished: true }) // Mongoose find method
                               .select('id title description url duration thumbnail createdAt'); // Mongoose select for attributes

    res.status(200).json({
      success: true,
      count: videos.length,
      data: videos
    });
  } catch (error) {
    console.error('Error in getAllVideos:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get single video
exports.getVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id); // Mongoose findById instead of findByPk

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // If user is authenticated, get their progress for this video
    let progress = null;
    if (req.user) {
      progress = await VideoProgress.findOne({ // Mongoose findOne
        userId: req.user.id,
        videoId: video._id // Use video._id
      });
    }

    res.status(200).json({
      success: true,
      data: video,
      progress: progress
    });
  } catch (error) {
    console.error('Error in getVideo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Create new video (admin only)
exports.createVideo = async (req, res) => {
  try {
    const { title, description, url, duration, thumbnail } = req.body;

    const video = await Video.create({ // Mongoose create
      title,
      description,
      url,
      duration,
      thumbnail
    });

    res.status(201).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('Error in createVideo:', error);
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Update video (admin only)
exports.updateVideo = async (req, res) => {
  try {
    const { title, description, url, duration, thumbnail, isPublished } = req.body;

    let video = await Video.findById(req.params.id); // Mongoose findById

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    // Update fields
    video.title = title !== undefined ? title : video.title;
    video.description = description !== undefined ? description : video.description;
    video.url = url !== undefined ? url : video.url;
    video.duration = duration !== undefined ? duration : video.duration;
    video.thumbnail = thumbnail !== undefined ? thumbnail : video.thumbnail;
    video.isPublished = isPublished !== undefined ? isPublished : video.isPublished;

    await video.save(); // Mongoose save for updating
    // Alternatively, use findByIdAndUpdate:
    // video = await Video.findByIdAndUpdate(req.params.id, req.body, {
    //   new: true, // return the updated document
    //   runValidators: true // run validation rules on update
    // });


    res.status(200).json({
      success: true,
      data: video
    });
  } catch (error) {
    console.error('Error in updateVideo:', error);
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Delete video (admin only)
exports.deleteVideo = async (req, res) => {
  try {
    const video = await Video.findById(req.params.id); // Mongoose findById

    if (!video) {
      return res.status(404).json({ message: 'Video not found' });
    }

    await video.deleteOne(); // Mongoose deleteOne for deleting a document
    // Alternatively, await Video.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error('Error in deleteVideo:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};