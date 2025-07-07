const express = require('express'), router = express.Router(), UserProgress = require('../models/UserProgress'), Pose = require('../models/Pose');

// Get user progress
router.get('/:username', async (req, res) => {
  try {
    console.log('Fetching progress for username:', req.params.username); // Debug log
    let progress = await UserProgress.findOne({ username: req.params.username });
    
    if (!progress) {
      console.log('Progress not found, creating new one for:', req.params.username); // Debug log
      progress = await new UserProgress({ username: req.params.username }).save();
      console.log('Created new progress for:', req.params.username); // Debug log
    } else {
      console.log('Found existing progress for:', req.params.username); // Debug log
    }
    
    console.log('Returning progress data:', { 
      username: progress.username, 
      streak: progress.streak, 
      poseHistoryCount: progress.poseHistory?.length || 0 
    }); // Debug log
    
    res.json(progress);
  } catch (e) {
    console.error('Error in progress route:', e); // Debug log
    res.status(500).json({ message: e.message });
  }
});

// Record pose completion
router.post('/complete', async (req, res) => {
  try {
    const { username, poseName } = req.body;
    
    if (!username || !poseName) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Get pose details
    const pose = await Pose.findOne({ name: poseName });
    if (!pose) {
      return res.status(404).json({ message: 'Pose not found' });
    }

    // Update progress
    const progress = await UserProgress.findOneAndUpdate(
      { username },
      { 
        $inc: { streak: 1 },
        $push: { 
          poseHistory: { 
            poseName: pose.name,
            date: new Date()
          } 
        },
        lastUpdated: new Date()
      },
      { new: true, upsert: true }
    );
    
    res.json(progress);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

// Daily challenge routes
router.get('/daily-challenge/:username', async (req, res) => {
  try {
    let progress = await UserProgress.findOne({ username: req.params.username });
    
    if (!progress?.dailyChallenge || 
        new Date(progress.dailyChallenge.date).toDateString() !== new Date().toDateString()) {
      // Generate new challenge
      const poses = await Pose.find().select('name difficulty benefits duration');
      const randomPose = poses[Math.floor(Math.random() * poses.length)];
      
      progress = await UserProgress.findOneAndUpdate(
        { username: req.params.username },
        { 
          dailyChallenge: {
            pose: randomPose,
            date: new Date(),
            completed: false
          }
        },
        { new: true, upsert: true }
      );
      
      return res.json(progress.dailyChallenge);
    }
    
    res.json(progress.dailyChallenge);
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Complete daily challenge
router.post('/daily-challenge/complete', async (req, res) => {
  try {
    const { username, poseName } = req.body;
    
    const progress = await UserProgress.findOneAndUpdate(
      { 
        username,
        'dailyChallenge.pose.name': poseName,
        'dailyChallenge.completed': false
      },
      { 
        'dailyChallenge.completed': true,
        lastUpdated: new Date()
      },
      { new: true }
    );
    
    if (!progress) {
      return res.status(404).json({ message: 'Challenge not found or already completed' });
    }
    
    res.json(progress);
  } catch (e) {
    res.status(400).json({ message: e.message });
  }
});

module.exports = router;