const express = require("express");
const router = express.Router();
const Enrollment = require("../models/Enrollment");
const Course = require("../models/Course");
const User = require("../models/User");
const protect = require("../middlewares/auth.middleware");

/**
 * ✅ ENROLL STUDENT IN COURSE
 */
router.post("/enroll/:courseId", protect, async (req, res) => {
  try {
    // Block enrollment for admin users
    if (req.user.role === "admin") {
      return res.status(403).json({ message: "Admin users cannot enroll in courses" });
    }

    const { courseId } = req.params;
    const studentId = req.user.id;

    // Check if course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if already enrolled
    const existingEnrollment = await Enrollment.findOne({
      student: studentId,
      course: courseId,
    });

    if (existingEnrollment) {
      return res.status(400).json({ message: "Already enrolled in this course" });
    }

    // Create enrollment
    const enrollment = await Enrollment.create({
      student: studentId,
      course: courseId,
    });

    // Add student to course's enrolledStudents
    course.enrolledStudents.push(studentId);
    await course.save();

    // Add course to user's enrolledCourses
    await User.findByIdAndUpdate(studentId, {
      $push: { enrolledCourses: courseId }
    });

    res.status(201).json({ 
      message: "Successfully enrolled in course", 
      enrollment 
    });
  } catch (error) {
    res.status(500).json({ message: "Error enrolling in course", error: error.message });
  }
});

/**
 * 📋 GET STUDENT'S ENROLLED COURSES
 */
router.get("/my-courses", protect, async (req, res) => {
  try {
    // Block for admin users
    if (req.user.role === "admin") {
      return res.json([]);
    }

    const enrollments = await Enrollment.find({ student: req.user.id })
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name email" }
      });

    res.json(enrollments);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrolled courses", error: error.message });
  }
});

/**
 * 🎯 GET ENROLLMENT DETAILS
 */
router.get("/:enrollmentId", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId)
      .populate("student", "name email")
      .populate({
        path: "course",
        populate: { path: "instructor", select: "name email" }
      });

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Check authorization
    if (enrollment.student._id.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to view this enrollment" });
    }

    res.json(enrollment);
  } catch (error) {
    res.status(500).json({ message: "Error fetching enrollment", error: error.message });
  }
});

/**
 * 📊 UPDATE PROGRESS
 */
router.put("/:enrollmentId/progress", protect, async (req, res) => {
  try {
    const { progress, videoId } = req.body;
    const enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Check authorization
    if (enrollment.student.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update this enrollment" });
    }

    if (progress !== undefined) {
      enrollment.progress = Math.min(progress, 100);
    }

    if (videoId) {
      enrollment.videosWatched.push({
        videoId,
        watchedAt: new Date(),
      });
    }

    if (enrollment.progress === 100) {
      enrollment.status = "completed";
      enrollment.completedAt = new Date();
    }

    await enrollment.save();
    res.json({ message: "Progress updated", enrollment });
  } catch (error) {
    res.status(500).json({ message: "Error updating progress", error: error.message });
  }
});

/**
 * 🗑️ UNENROLL FROM COURSE
 */
router.delete("/:enrollmentId", protect, async (req, res) => {
  try {
    const enrollment = await Enrollment.findById(req.params.enrollmentId);

    if (!enrollment) {
      return res.status(404).json({ message: "Enrollment not found" });
    }

    // Check authorization
    if (enrollment.student.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to delete this enrollment" });
    }

    await Enrollment.findByIdAndDelete(req.params.enrollmentId);

    // Remove from user's enrolledCourses
    await User.findByIdAndUpdate(enrollment.student, {
      $pull: { enrolledCourses: enrollment.course }
    });

    // Remove from course's enrolledStudents
    await Course.findByIdAndUpdate(enrollment.course, {
      $pull: { enrolledStudents: enrollment.student }
    });

    res.json({ message: "Unenrolled from course successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error unenrolling", error: error.message });
  }
});

module.exports = router;
