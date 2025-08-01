const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Import Mongoose User model directly

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email }); // Mongoose findOne instead of Sequelize findOne
    if (userExists) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = await User.create({ // Mongoose create instead of Sequelize create
      username,
      email,
      password,
      firstName,
      lastName
    });

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, // Use user._id for Mongoose documents
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Return user and token
    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id, // Use user._id
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Error in register:', error);
    // Handle validation errors from Mongoose
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    if (error.code === 11000) { // Duplicate key error for unique fields
      return res.status(400).json({ message: 'Duplicate field value entered' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Login user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists (select password to compare)
    const user = await User.findOne({ email }).select('+password'); // Mongoose findOne
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Check if password matches
    const isMatch = await user.validatePassword(password); // Mongoose model method
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id }, // Use user._id
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE }
    );

    // Return user and token
    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id, // Use user._id
        username: user.username,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName
      }
    });
  } catch (error) {
    console.error('Error in login:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get current user
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password'); // Mongoose findById instead of findByPk
    // The .select('-password') explicitly excludes the password field.

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};