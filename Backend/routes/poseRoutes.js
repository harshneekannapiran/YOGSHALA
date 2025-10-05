const express = require('express'), router = express.Router(), Pose = require('../models/Pose');

// Get all poses
router.get('/', async (req, res) => {
  try {
    res.json(await Pose.find().select('-__v'));
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
});

// Get pose by name
router.get('/:name', async (req, res) => {
  try {
    const pose = await Pose.findOne({ name: req.params.name }).select('-__v');
    if (!pose) {
      return res.status(404).json({ 
        message: 'Pose not found' 
      });
    }
    res.json(pose);
  } catch (error) {
    res.status(500).json({ 
      message: error.message 
    });
  }
});

module.exports = router;