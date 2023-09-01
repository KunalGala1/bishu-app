const mongoose = require('mongoose');

const BlogpostSchema = new mongoose.Schema({
  body: {
    type: String,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Blogpost', BlogpostSchema, 'blogposts');
