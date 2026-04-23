const express = require("express");
const router = express.Router();

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const protect = require("../middlewares/auth.middleware");

/* 🔥 BUTTONS API */
router.get("/buttons", (req, res) => {
  res.json([
    { name: "Login", path: "/login" },
    { name: "Register", path: "/register" }
  ]);
});

/* 🔐 REGISTER */
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
    });

    res.json({
      message: "User registered",
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* 🔐 LOGIN */
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });

  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

/* 🔐 PROTECTED */
router.get("/me", protect, async (req, res) => {
  res.json({ message: "Protected data", user: req.user });
});

module.exports = router;