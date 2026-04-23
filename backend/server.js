require("dotenv").config();
const express = require("express");
const authRoutes = require("./routes/auth.routes");
const courseRoutes = require("./routes/courseRoutes");
const enrollmentRoutes = require("./routes/enrollment.routes");
const app = express();
const cors = require('cors');
const fileUpload = require('express-fileupload');
const PORT = process.env.PORT || 5000;
const connectDB = require('./config/db')


app.use(cors());
connectDB();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(fileUpload());

app.get("/", (req, res) => {
  res.send("Hello world");
});

app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/profile", require("./routes/profile.routes"));
app.use("/api/admin", require("./routes/adminUser.routes"));
app.use("/api/admin-courses", require("./routes/adminCourse.routes"));
app.use("/api/enrollment", enrollmentRoutes);
app.use("/api/courses", require("./routes/courseRoutes"));

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});