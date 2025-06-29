const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const { body, validationResult } = require('express-validator');
const connectDB = require('./config/database');
const User = require('./models/User');
const Friend = require('./models/Friend');
const Location = require('./models/Location');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// JWT Secret (use environment variable in production)
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Middleware to verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Access token required' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(403).json({ message: 'User not found' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(403).json({ message: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Token expired' });
    }
    return res.status(500).json({ message: 'Server error' });
  }
};

// Validation middleware
const validateSignup = [
  body('firstName').trim().isLength({ min: 1 }).withMessage('First name is required'),
  body('lastName').trim().isLength({ min: 1 }).withMessage('Last name is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
];

const validateSignin = [
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('password').notEmpty().withMessage('Password is required'),
];

const validatePasswordChange = [
  body('currentPassword').notEmpty().withMessage('Current password is required'),
  body('newPassword').isLength({ min: 6 }).withMessage('New password must be at least 6 characters long'),
];

const validateFriend = [
  body('username').trim().isLength({ min: 1 }).withMessage('Username is required'),
  body('email').isEmail().normalizeEmail().withMessage('Valid email is required'),
  body('location.lat').isFloat({ min: -90, max: 90 }).withMessage('Valid latitude is required'),
  body('location.lng').isFloat({ min: -180, max: 180 }).withMessage('Valid longitude is required'),
];

// Routes

// Health check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AllClear API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

// Sign up endpoint
app.post('/api/auth/signup', validateSignup, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { firstName, lastName, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password
    });

    await newUser.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: newUser._id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.status(201).json({
      message: 'User created successfully',
      token,
      user: newUser.toProfileJSON()
    });

  } catch (error) {
    console.error('Signup error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Sign in endpoint
app.post('/api/auth/signin', validateSignin, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { email, password } = req.body;

    // Find user by email
    const user = await User.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if user is active
    if (!user.isActive) {
      return res.status(401).json({ message: 'Account is deactivated' });
    }

    // Check password
    const isValidPassword = await user.comparePassword(password);
    if (!isValidPassword) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data and token
    res.json({
      message: 'Sign in successful',
      token,
      user: user.toProfileJSON()
    });

  } catch (error) {
    console.error('Signin error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get user profile (protected)
app.get('/api/user/profile', authenticateToken, (req, res) => {
  res.json({ user: req.user.toProfileJSON() });
});

// Update user profile (protected)
app.put('/api/user/profile', authenticateToken, async (req, res) => {
  try {
    const { firstName, lastName, email } = req.body;
    const user = await User.findById(req.user._id);
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if email is being changed and if it's already taken
    if (email && email !== user.email) {
      const existingUser = await User.findByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'Email already in use' });
      }
    }

    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (email) user.email = email;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: user.toProfileJSON()
    });

  } catch (error) {
    console.error('Profile update error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Change password (protected)
app.put('/api/user/change-password', authenticateToken, validatePasswordChange, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Verify current password
    const isValidPassword = await user.comparePassword(currentPassword);
    if (!isValidPassword) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      message: 'Password changed successfully'
    });

  } catch (error) {
    console.error('Password change error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete account (protected)
app.delete('/api/user/delete-account', authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await User.findByIdAndDelete(req.user._id);

    res.json({
      message: 'Account deleted successfully'
    });

  } catch (error) {
    console.error('Account deletion error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Friend Management Endpoints

// Get all friends for a user (protected)
app.get('/api/friends', authenticateToken, async (req, res) => {
  try {
    const friends = await Friend.findByUserId(req.user._id);
    const friendsForMap = friends.map(friend => friend.toMapJSON());
    
    res.json({ friends: friendsForMap });
  } catch (error) {
    console.error('Get friends error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new friend (protected)
app.post('/api/friends', authenticateToken, validateFriend, async (req, res) => {
  try {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        message: 'Validation failed', 
        errors: errors.array() 
      });
    }

    const { username, email, location, status } = req.body;

    // Check if friend already exists for this user
    const existingFriend = await Friend.existsForUser(req.user._id, email);
    if (existingFriend) {
      return res.status(400).json({ message: 'Friend with this email already exists' });
    }

    // Create new friend
    const newFriend = new Friend({
      userId: req.user._id,
      username,
      email,
      location,
      status: status || 'Unknown'
    });

    await newFriend.save();

    res.status(201).json({
      message: 'Friend added successfully',
      friend: newFriend.toMapJSON()
    });

  } catch (error) {
    console.error('Add friend error:', error);
    
    // Handle MongoDB duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Friend with this email already exists' });
    }
    
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update friend status
app.put('/api/friends/:id/status', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = req.user.id;

    const friend = await Friend.findOne({ _id: id, userId });
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    friend.status = status;
    friend.lastUpdated = new Date();
    await friend.save();

    res.json({ friend });
  } catch (error) {
    console.error('Error updating friend status:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update friend location
app.put('/api/friends/:id/location', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;
    const userId = req.user.id;

    // Validate coordinates
    if (typeof lat !== 'number' || typeof lng !== 'number' || 
        lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const friend = await Friend.findOne({ _id: id, userId });
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    friend.location.lat = lat;
    friend.location.lng = lng;
    friend.lastUpdated = new Date();
    await friend.save();

    res.json({ friend });
  } catch (error) {
    console.error('Error updating friend location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete friend (protected)
app.delete('/api/friends/:friendId', authenticateToken, async (req, res) => {
  try {
    const { friendId } = req.params;

    const friend = await Friend.findOne({ _id: friendId, userId: req.user._id });
    
    if (!friend) {
      return res.status(404).json({ message: 'Friend not found' });
    }

    friend.isActive = false;
    await friend.save();

    res.json({
      message: 'Friend removed successfully'
    });

  } catch (error) {
    console.error('Delete friend error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all users (for admin purposes - protected)
app.get('/api/users', authenticateToken, async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ users });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get all locations for a user
app.get('/api/locations', authenticateToken, async (req, res) => {
  try {
    const locations = await Location.find({ userId: req.user.id });
    res.json({ locations: locations.map(location => location.toMapJSON()) });
  } catch (error) {
    console.error('Error fetching locations:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Add a new location
app.post('/api/locations', authenticateToken, async (req, res) => {
  try {
    const { name, type, location, description } = req.body;

    if (!name || !location || !location.lat || !location.lng) {
      return res.status(400).json({ message: 'Name and coordinates are required' });
    }

    // Validate coordinates
    if (location.lat < -90 || location.lat > 90 || location.lng < -180 || location.lng > 180) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const newLocation = new Location({
      userId: req.user.id,
      name,
      type: type || 'Other',
      location: {
        lat: location.lat,
        lng: location.lng
      },
      description: description || ''
    });

    await newLocation.save();
    res.status(201).json({ location: newLocation.toMapJSON() });
  } catch (error) {
    console.error('Error creating location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Update location coordinates
app.put('/api/locations/:id/coordinates', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { lat, lng } = req.body;
    const userId = req.user.id;

    // Validate coordinates
    if (typeof lat !== 'number' || typeof lng !== 'number' || 
        lat < -90 || lat > 90 || lng < -180 || lng > 180) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    const location = await Location.findOne({ _id: id, userId });
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    location.location.lat = lat;
    location.location.lng = lng;
    await location.save();

    res.json({ location: location.toMapJSON() });
  } catch (error) {
    console.error('Error updating location coordinates:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Delete a location
app.delete('/api/locations/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const location = await Location.findOneAndDelete({ _id: id, userId });
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }

    res.json({ message: 'Location deleted successfully' });
  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Health check: http://localhost:${PORT}/api/health`);
}); 