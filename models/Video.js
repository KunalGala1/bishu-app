const mongoose = require('mongoose');

const VideoSchema = new mongoose.Schema({
  body: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Video', VideoSchema, 'videos');
