const User = require("../models/User");

const adminOnly = async (req, res, next) => {
  if (req.user?.role === "admin" || req.user?.id === "admin") {
    return next();
  }

  const user = await User.findById(req.user.id);
  if (!user || user.role !== "admin") {
    return res.status(403).json({ message: "Admin only access" });
  }

  next();
};

module.exports = adminOnly;