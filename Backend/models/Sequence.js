const mongoose = require('mongoose');

const poseInSequenceSchema = new mongoose.Schema({
  name: {type: String, required: true},
  duration: {type: Number, required: true, min: 10}
});

const sequenceSchema = new mongoose.Schema({
  username: {type: String, required: true},
  name: {type: String, required: true, trim: true},
  poses: [poseInSequenceSchema],
  totalDuration: {type: Number, required: true},
  isDefault: {type: Boolean, default: false},
  createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model('Sequence', sequenceSchema);