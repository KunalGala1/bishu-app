const mongoose = require("mongoose");

const Video = require("./Video");

const FeaturedVideoSchema = new mongoose.Schema({
  video: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Video",
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("FeaturedVideo", FeaturedVideoSchema);
