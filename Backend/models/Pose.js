const mongoose = require('mongoose');

const poseSchema = new mongoose.Schema({
  name: {type: String, required: true, unique: true},
  difficulty: {type: String, required: true, enum: ['Beginner', 'Intermediate', 'Advanced']},
  benefits: {type: String, required: true},
  duration: {type: Number, default: 60, min: 10},
  instruction: {type: String, required: true},
  image: String
});

module.exports = mongoose.model('Pose', poseSchema);