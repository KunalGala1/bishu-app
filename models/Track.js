const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({
  body: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Track', TrackSchema, 'tracks');
