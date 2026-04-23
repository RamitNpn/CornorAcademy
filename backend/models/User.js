const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    default: "student", // default student
    enum: ["student", "instructor", "admin"]
  },
  level: {
    type: String,
    default: "College",
    enum: ["School", "College", "University", "Professional"]
  },
  class: {
    type: String,
    default: "Not assigned",
  },
  rollNo: {
    type: String,
    default: "N/A",
  },
  department: {
    type: String,
    default: "Computer Science",
  },
  profileImage: {
    type: String,
    default: null,
  },
  bio: {
    type: String,
    default: "",
  },
  enrolledCourses: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course"
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);