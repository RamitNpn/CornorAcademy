const express = require("express");
const router = express.Router();
const Course = require("../models/Course");
const User = require("../models/User");
const Enrollment = require("../models/Enrollment");
const protect = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/admin.middleware");
const cloudinary = require("../config/cloudinary");

/**
 * ✅ CREATE COURSE (Admin/Instructor Only)
 */
router.post("/create", protect, async (req, res) => {
  try {
    const { title, description, level, duration, price } = req.body;
    
    if (!title || !description) {
      return res.status(400).json({ message: "Title and description required" });
    }

    const course = await Course.create({
      title,
      description,
      level: level || "College",
      duration: duration || "4 weeks",
      price: price || 0,
      instructor: req.user._id,
      createdBy: req.user._id,
    });

    res.status(201).json({ message: "Course created successfully", course });
  } catch (error) {
    res.status(500).json({ message: "Error creating course", error: error.message });
  }
});

/**
 * 🎬 UPLOAD VIDEO TO COURSE
 */
router.post("/:courseId/upload-video", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { videoFile, title } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if user is the instructor
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to upload video" });
    }

    if (!videoFile) {
      return res.status(400).json({ message: "Video file required" });
    }

    // Upload to Cloudinary
    try {
      const result = await cloudinary.uploader.upload(videoFile, {
        resource_type: "video",
        folder: "lms/courses",
        public_id: `${courseId}-${Date.now()}`,
      });

      const video = {
        title: title || "Untitled Video",
        videoUrl: result.secure_url,
        duration: result.duration,
      };

      course.videos.push(video);
      await course.save();

      res.status(201).json({ 
        message: "Video uploaded successfully", 
        video,
        course 
      });
    } catch (cloudError) {
      return res.status(500).json({ 
        message: "Cloudinary upload failed", 
        error: cloudError.message 
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error uploading video", error: error.message });
  }
});

/**
 * 📸 UPLOAD COURSE IMAGE
 */
router.post("/:courseId/upload-image", protect, async (req, res) => {
  try {
    const { courseId } = req.params;
    const { imageFile } = req.body;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (!imageFile) {
      return res.status(400).json({ message: "Image file required" });
    }

    try {
      const result = await cloudinary.uploader.upload(imageFile, {
        folder: "lms/courses/images",
        public_id: `${courseId}`,
      });

      course.image = result.secure_url;
      await course.save();

      res.json({ message: "Course image uploaded successfully", course });
    } catch (cloudError) {
      return res.status(500).json({ 
        message: "Cloudinary upload failed", 
        error: cloudError.message 
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error uploading image", error: error.message });
  }
});

/**
 * 📝 GET ALL COURSES (with filtering)
 */
router.get("/", async (req, res) => {
  try {
    const { level, instructor } = req.query;
    let query = { isPublished: true };

    if (level) query.level = level;
    if (instructor) query.instructor = instructor;

    const courses = await Course.find(query)
      .populate("instructor", "name email")
      .populate("enrolledStudents", "name email");

    res.json(courses);
  } catch (error) {
    res.status(500).json({ message: "Error fetching courses", error: error.message });
  }
});

/**
 * 🔍 GET SINGLE COURSE
 */
router.get("/:courseId", async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId)
      .populate("instructor", "name email bio")
      .populate("enrolledStudents", "name email");

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json(course);
  } catch (error) {
    res.status(500).json({ message: "Error fetching course", error: error.message });
  }
});

/**
 * ✏️ UPDATE COURSE
 */
router.put("/:courseId", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized to update course" });
    }

    const updated = await Course.findByIdAndUpdate(
      req.params.courseId,
      req.body,
      { new: true }
    );

    res.json({ message: "Course updated successfully", course: updated });
  } catch (error) {
    res.status(500).json({ message: "Error updating course", error: error.message });
  }
});

/**
 * 🗑️ DELETE COURSE
 */
router.delete("/:courseId", protect, adminOnly, async (req, res) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.courseId);
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    res.json({ message: "Course deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting course", error: error.message });
  }
});

module.exports = router;
