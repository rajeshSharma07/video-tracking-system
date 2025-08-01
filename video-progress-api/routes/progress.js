const express = require('express');
const router = express.Router();
const {
  getUserProgress,
  getVideoProgress,
  updateProgress,
  resetProgress
} = require('../controllers/progressController');
const { protect } = require('../middleware/auth');

// All routes are protected
router.use(protect);

// Get user's progress for all videos
router.get('/', getUserProgress);

// Get user's progress for a specific video
router.get('/:videoId', getVideoProgress);

// Update progress for a video
router.post('/:videoId', updateProgress);

// Reset progress for a video
router.delete('/:videoId', resetProgress);

module.exports = router;