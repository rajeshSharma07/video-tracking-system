const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');

// Import user controller when created
// const { getUser, updateUser, deleteUser } = require('../controllers/userController');

// All routes are protected
router.use(protect);

// Placeholder for user routes
router.get('/', (req, res) => {
  res.status(200).json({ message: 'User routes are working' });
});

module.exports = router;