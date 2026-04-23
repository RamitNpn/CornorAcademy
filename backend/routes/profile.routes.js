const express = require("express");
const router = express.Router();
const protect = require("../middlewares/auth.middleware");
const User = require("../models/User");

/**
 * 👤 GET LOGGED USER PROFILE
 */
router.get("/me", protect, async (req, res) => {
  try {
    // Handle env-based admin user
    if (req.user.id === "admin" && req.user.role === "admin") {
      return res.json({
        _id: "admin",
        name: "Admin",
        email: process.env.ADMIN_ID,
        role: "admin",
      });
    }

    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Error fetching profile", error: err.message });
  }
});

/**
 * 🌐 GET PUBLIC USER PROFILE
 */
router.get("/user/:id", async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  res.json(user);
});

/**
 * ✏️ UPDATE PROFILE (SAVE TO DB)
 */
router.put("/update", protect, async (req, res) => {
  try {
    // Block profile updates for env admin user
    if (req.user.id === "admin" && req.user.role === "admin") {
      return res.status(403).json({ message: "Cannot modify env-based admin profile" });
    }

    const { name, email, class: cls, rollNo, department } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.email = email || user.email;
    user.class = cls || user.class;
    user.rollNo = rollNo || user.rollNo;
    user.department = department || user.department;

    await user.save(); // 🔥 IMPORTANT: THIS SAVES TO DB

    res.json({
      message: "Profile updated successfully",
      user,
    });

  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;