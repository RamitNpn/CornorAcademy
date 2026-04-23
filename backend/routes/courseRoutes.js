const express = require("express");
const router = express.Router();

const Course = require("../models/Course");
const protect = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/admin.middleware");

/**
 * 📚 CREATE COURSE (Admin only)
 */
router.post("/", protect, adminOnly, async (req, res) => {
  try {
    const { title, description, level, duration, price } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: "Title & description required" });
    }

    const course = await Course.create({
      title,
      description,
      level,
      duration,
      price,
      instructor: req.user.id,
      createdBy: req.user.id,
    });

    res.status(201).json({
      message: "Course created successfully",
      course,
    });

  } catch (err) {
    res.status(500).json({
      message: "Error creating course",
      error: err.message,
    });
  }
});

/**
 * 📚 GET ALL COURSES
 */
router.get("/", async (req, res) => {
  try {
    const courses = await Course.find()
      .populate("instructor", "name email")
      .sort({ createdAt: -1 });

    res.json(courses);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching courses",
      error: err.message,
    });
  }
});

/**
 * 🔍 GET SINGLE COURSE
 */
router.get("/:id", async (req, res) => {
  try {
    const course = await Course.findById(req.params.id)
      .populate("instructor", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    res.status(500).json({
      message: "Error fetching course",
      error: err.message,
    });
  }
});

/**
 * ✏️ UPDATE COURSE
 */
router.put("/:id", protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Course updated",
      course,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error updating course",
      error: err.message,
    });
  }
});

/**
 * ❌ DELETE COURSE
 */
router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.id);

    res.json({
      message: "Course deleted",
    });
  } catch (err) {
    res.status(500).json({
      message: "Error deleting course",
      error: err.message,
    });
  }
});

module.exports = router;