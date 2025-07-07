const express = require('express'), router = express.Router(), User = require('../models/User');

// Test route
router.get('/test', (req, res) => {
  res.json({ message: 'User routes are working!' });
});

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, username, password } = req.body;
    
    console.log('Received signup request:', { email, username, password: '***' }); // Debug log
    
    // Check if user exists
    if (await User.findOne({ $or: [{ email }, { username }] })) {
      console.log('User already exists:', username); // Debug log
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email or username already exists' 
      });
    }

    console.log('Creating new user...'); // Debug log
    const user = new User({ email, username, password });
    await user.save();
    console.log('User saved successfully:', username); // Debug log
    console.log('User document ID:', user._id); // Debug log

    // Initialize user progress
    console.log('About to initialize user progress for:', username); // Debug log
    await initializeUserProgress(username);
    console.log('User progress initialization completed for:', username); // Debug log
    
    // Verify progress was created
    const UserProgress = require('../models/UserProgress');
    const verifyProgress = await UserProgress.findOne({ username });
    if (verifyProgress) {
      console.log('✅ UserProgress verified after signup for:', username); // Debug log
    } else {
      console.log('❌ UserProgress NOT found after signup for:', username); // Debug log
    }
    
    res.status(201).json({ 
      success: true, 
      username,
      message: 'User created successfully' 
    });
  } catch (error) {
    console.error('Error in signup:', error); // Debug log
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Received login request:', { email, password: '***' }); // Debug log
    
    const user = await User.findOne({ email });
    
    if (!user || user.password !== password) {
      console.log('User not found for login:', email); // Debug log
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }
    
    console.log('User logged in successfully:', user.username); // Debug log
    console.log('Previous lastLogin:', user.lastLogin); // Debug log
    
    // Update last login
    user.lastLogin = new Date();
    await user.save();
    console.log('Updated lastLogin to:', user.lastLogin); // Debug log
    
    res.json({ 
      success: true, 
      username: user.username,
      message: 'Login successful' 
    });
  } catch (error) {
    console.error('Error in login:', error); // Debug log
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get user progress
router.get('/progress/:username', async (req, res) => {
  try {
    const UserProgress = require('../models/UserProgress');
    let userProgress = await UserProgress.findOne({ username: req.params.username });
    
    if (!userProgress) {
      console.log('User progress not found, creating new one for:', req.params.username); // Debug log
      userProgress = await new UserProgress({ username: req.params.username }).save();
      console.log('Created new user progress for:', req.params.username); // Debug log
    }
    
    res.json(userProgress);
  } catch (error) {
    console.error('Error getting user progress:', error); // Debug log
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Get last login time
router.get('/last-login/:username', async (req, res) => {
  try {
    console.log('Fetching last login for username:', req.params.username); // Debug log
    const user = await User.findOne({ username: req.params.username });
    
    if (!user) {
      console.log('User not found for last login:', req.params.username); // Debug log
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    console.log('Last login found for:', req.params.username, ':', user.lastLogin); // Debug log
    
    res.json({ 
      success: true, 
      lastLogin: user.lastLogin 
    });
  } catch (error) {
    console.error('Error getting last login:', error); // Debug log
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
});

// Helper function to initialize user progress
async function initializeUserProgress(username) {
  try {
    console.log('Initializing user progress for:', username); // Debug log
    const UserProgress = require('../models/UserProgress');
    if (!await UserProgress.findOne({ username })) {
      console.log('Creating new user progress for:', username); // Debug log
      const userProgress = await new UserProgress({ username }).save();
      console.log('User progress created successfully for:', username); // Debug log
      console.log('User progress document ID:', userProgress._id); // Debug log

      // Verify progress was actually saved
      const verifyProgress = await UserProgress.findById(userProgress._id);
      if (verifyProgress) {
        console.log('User progress verified in database:', verifyProgress.username); // Debug log
      } else {
        console.log('ERROR: User progress not found in database after save!'); // Debug log
      }
    } else {
      console.log('User progress already exists for:', username); // Debug log
    }
  } catch (error) {
    console.error('Error initializing user progress for', username, ':', error); // Debug log
    throw error; // Re-throw to be handled by the signup function
  }
}

module.exports = router;