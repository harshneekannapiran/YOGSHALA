const express = require('express'), router = express.Router(), Sequence = require('../models/Sequence');

// Get all sequences for a user
router.get('/user/:username', async (req, res) => {
  try {
    console.log('Fetching sequences for user:', req.params.username); // Debug log
    
    const sequences = await Sequence.find({ username: req.params.username })
      .select('-__v')
      .sort({ createdAt: -1 });
    
    console.log('Found sequences for user:', sequences); // Debug log
    res.json(sequences);
  } catch (error) {
    console.error('Error fetching user sequences:', error); // Debug log
    res.status(500).json({ 
      message: error.message 
    });
  }
});

// Create new sequence
router.post('/', async (req, res) => {
  try {
    const { username, name, poses } = req.body;
    
    console.log('Received sequence creation request:', { username, name, poses }); // Debug log
    
    if (!username || !name || !poses || poses.length === 0) {
      console.log('Missing required fields:', { username, name, poses }); // Debug log
      return res.status(400).json({ 
        message: 'Missing required fields' 
      });
    }

    const totalDuration = poses.reduce((sum, pose) => sum + (pose.duration || 60), 0);
    const sequence = new Sequence({ 
      username, 
      name, 
      poses, 
      totalDuration 
    });
    
    console.log('Saving sequence to database:', sequence); // Debug log
    await sequence.save();
    console.log('Sequence saved successfully:', sequence); // Debug log
    
    res.status(201).json(sequence);
  } catch (error) {
    console.error('Error creating sequence:', error); // Debug log
    res.status(400).json({ 
      message: error.message 
    });
  }
});

// Delete sequence
router.delete('/:id', async (req, res) => {
  try {
    const sequence = await Sequence.findByIdAndDelete(req.params.id);
    if (!sequence) {
      return res.status(404).json({ 
        message: 'Sequence not found' 
      });
    }
    res.json({ 
      message: 'Sequence deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      message: error.message 
    });
  }
});

// Get default sequences
router.get('/defaults', async (req, res) => {
  try {
    console.log('Fetching default sequences'); // Debug log
    
    const defaultSequences = await Sequence.find({ isDefault: true })
      .select('-__v')
      .sort({ name: 1 });
    
    console.log('Found default sequences:', defaultSequences); // Debug log
    res.json(defaultSequences);
  } catch (error) {
    console.error('Error fetching default sequences:', error); // Debug log
    res.status(500).json({ 
      message: error.message 
    });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { name, poses } = req.body;
    const totalDuration = poses.reduce((sum, pose) => sum + (pose.duration || 60), 0);
    
    const sequence = await Sequence.findByIdAndUpdate(
      req.params.id,
      { name, poses, totalDuration },
      { new: true }
    );
    
    if (!sequence) {
      return res.status(404).json({ message: 'Sequence not found' });
    }
    
    res.json(sequence);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Get sequence by ID
router.get('/:id', async (req, res) => {
  try {
    const sequence = await Sequence.findById(req.params.id).select('-__v');
    if (!sequence) {
      return res.status(404).json({ message: 'Sequence not found' });
    }
    res.json(sequence);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;