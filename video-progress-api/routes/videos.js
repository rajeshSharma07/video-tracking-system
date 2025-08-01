const express = require('express');
const router = express.Router();
const {
  getAllVideos,
  getVideo,
  createVideo,
  updateVideo,
  deleteVideo
} = require('../controllers/videoController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', getAllVideos);
router.get('/:id', getVideo);

// Protected routes (admin only)
router.post('/', protect, createVideo);
router.put('/:id', protect, updateVideo);
router.delete('/:id', protect, deleteVideo);

module.exports = router;