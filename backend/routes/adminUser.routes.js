const express = require("express");
const router = express.Router();
const User = require("../models/User");
const Course = require("../models/Course");
const Enrollment = require("../models/Enrollment");
const protect = require("../middlewares/auth.middleware");
const adminOnly = require("../middlewares/admin.middleware");
const bcrypt = require("bcryptjs");
const cloudinary = require("../config/cloudinary");

/**
 * 📊 GET ALL USERS
 */
router.get("/users", protect, adminOnly, async (req, res) => {
  try {
    const { role, level } = req.query;
    let query = {};

    if (role) query.role = role;
    if (level) query.level = level;

    const users = await User.find(query)
      .select("-password")
      .populate("enrolledCourses", "title description");

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error: error.message });
  }
});

/**
 * 📋 GET SINGLE USER
 */
router.get("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select("-password")
      .populate("enrolledCourses");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: "Error fetching user", error: error.message });
  }
});

/**
 * ➕ ADD USER (ADMIN CREATE USER)
 */
router.post("/users", protect, adminOnly, async (req, res) => {
  try {
    const { name, email, password, role, level, department, class: userClass } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Name, email, and password required" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: role || "student",
      level: level || "College",
      department,
      class: userClass,
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(201).json({ 
      message: "User created successfully", 
      user: userWithoutPassword 
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already exists" });
    }
    res.status(500).json({ message: "Error creating user", error: error.message });
  }
});

/**
 * ✏️ UPDATE USER
 */
router.put("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const { name, role, level, department, class: userClass, bio } = req.body;
    
    const updateData = {};
    if (name) updateData.name = name;
    if (role) updateData.role = role;
    if (level) updateData.level = level;
    if (department) updateData.department = department;
    if (userClass) updateData.class = userClass;
    if (bio) updateData.bio = bio;

    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    ).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error updating user", error: error.message });
  }
});

/**
 * ❌ DELETE USER
 */
router.delete("/users/:id", protect, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Remove user from all courses
    await Course.updateMany({}, { $pull: { enrolledStudents: user._id } });
    
    // Delete all enrollments
    await Enrollment.deleteMany({ student: user._id });

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user", error: error.message });
  }
});

/**
 * 🔐 CHANGE USER PASSWORD (Admin)
 */
router.put("/users/:id/change-password", protect, adminOnly, async (req, res) => {
  try {
    const { newPassword } = req.body;

    if (!newPassword) {
      return res.status(400).json({ message: "New password required" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { password: hashedPassword },
      { new: true }
    ).select("-password");

    res.json({ message: "Password changed successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Error changing password", error: error.message });
  }
});

/**
 * 📸 UPLOAD USER PROFILE IMAGE
 */
router.post("/users/:id/profile-image", protect, adminOnly, async (req, res) => {
  try {
    const { imageFile } = req.body;

    if (!imageFile) {
      return res.status(400).json({ message: "Image file required" });
    }

    try {
      const result = await cloudinary.uploader.upload(imageFile, {
        folder: "lms/profiles",
        public_id: `user-${req.params.id}`,
      });

      const user = await User.findByIdAndUpdate(
        req.params.id,
        { profileImage: result.secure_url },
        { new: true }
      ).select("-password");

      res.json({ message: "Profile image uploaded successfully", user });
    } catch (cloudError) {
      return res.status(500).json({ 
        message: "Cloudinary upload failed", 
        error: cloudError.message 
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Error uploading profile image", error: error.message });
  }
});

/**
 * 📊 GET DASHBOARD ANALYTICS
 */
router.get("/stats", protect, adminOnly, async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const students = await User.countDocuments({ role: "student" });
    const instructors = await User.countDocuments({ role: "instructor" });
    const admins = await User.countDocuments({ role: "admin" });
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Enrollment.countDocuments();

    // Get level distribution
    const levelDistribution = await User.aggregate([
      { $match: { role: "student" } },
      { $group: { _id: "$level", count: { $sum: 1 } } }
    ]);

    // Get enrollment by course
    const enrollmentByCourse = await Enrollment.aggregate([
      { $group: { _id: "$course", count: { $sum: 1 } } },
      { $lookup: { from: "courses", localField: "_id", foreignField: "_id", as: "course" } },
      { $unwind: "$course" },
      { $project: { courseName: "$course.title", count: 1 } }
    ]);

    res.json({
      users: {
        total: totalUsers,
        students,
        instructors,
        admins,
      },
      courses: totalCourses,
      enrollments: totalEnrollments,
      distribution: {
        byLevel: levelDistribution,
        byEnrollment: enrollmentByCourse,
      }
    });
  } catch (error) {
    res.status(500).json({ message: "Error fetching analytics", error: error.message });
  }
});

module.exports = router;