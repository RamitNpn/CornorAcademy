const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

/**
 * 🔐 Generate JWT Token
 */
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

/**
 * 🧑 REGISTER USER
 */
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: "user",
    });

    res.status(201).json({
      message: "User created successfully",
      token: generateToken(user),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 🔑 LOGIN (USER + ADMIN)
 */
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 👉 ADMIN LOGIN CHECK (from ENV)
    if (
      email === process.env.ADMIN_ID &&
      password === process.env.ADMIN_PASS
    ) {
      const adminToken = jwt.sign(
        {
          id: "admin",
          role: "admin",
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      return res.json({
        message: "Admin login successful",
        token: adminToken,
        user: {
          name: "Admin",
          email: process.env.ADMIN_ID,
          role: "admin",
        },
      });
    }

    // 👉 NORMAL USER LOGIN
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    res.json({
      message: "Login successful",
      token: generateToken(user),
      user,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/**
 * 👤 GET CURRENT USER (/me)
 */
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};