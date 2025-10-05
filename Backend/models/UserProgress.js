const mongoose = require('mongoose');

const userProgressSchema = new mongoose.Schema({
  username: {type: String, required: true, unique: true},
  streak: {type: Number, default: 0},
  poseHistory: [{poseName: String, date: {type: Date, default: Date.now}}],
  dailyChallenge: {
    pose: {name: String, difficulty: String, benefits: String, duration: Number},
    date: Date, completed: Boolean
  },
  lastUpdated: {type: Date, default: Date.now}
});

module.exports = mongoose.model('UserProgress', userProgressSchema);