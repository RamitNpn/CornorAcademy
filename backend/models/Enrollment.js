const mongoose = require("mongoose");

const enrollmentSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  enrolledAt: {
    type: Date,
    default: Date.now,
  },
  progress: {
    type: Number,
    default: 0, // percentage
  },
  videosWatched: [{
    videoId: String,
    watchedAt: Date,
  }],
  status: {
    type: String,
    enum: ["active", "completed", "paused"],
    default: "active",
  },
  completedAt: Date,
}, { timestamps: true });

module.exports = mongoose.model("Enrollment", enrollmentSchema);
