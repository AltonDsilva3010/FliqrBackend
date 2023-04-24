const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  url: String,
  filename: String,
});

const VideoSchema = Schema({
  authorName: {
    type: String,
  },
  title: {
    type: String,
  },
  subtitle: {
    type: String,
  },
  VideoUrl: {
    type: String,
    default: "AAAAA",
  },
  description: String,
  likes: {
    type: Number,
    default: 0,
  },
  views: {
    type: Number,
    default: 0,
  },
  poster: [ImageSchema],
  speakerName: {
    type: String,
  },

  type: {
    type: String,
    enum: ["Audio", "Video"],
  },
  category: {
    type: String,
    enum: [
      "Fitness",
      "Entertainment",
      "Bussiness",
      "Spiritual",
      "Education",
      "Others",
    ],
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  Length: {
    type: Number,
  },
});

module.exports = Video = mongoose.model("Video", VideoSchema);
