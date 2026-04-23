const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
  title: String,
  videoUrl: String,
  duration: String,
});

const courseSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      default: "",
    },

    level: {
      type: String,
      default: "Beginner",
    },

    duration: {
      type: String,
      default: "4 weeks",
    },

    price: {
      type: Number,
      default: 0,
    },

    videos: [videoSchema],

    instructor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", courseSchema);