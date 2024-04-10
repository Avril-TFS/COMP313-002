// // server.js

const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const bodyParser = require("body-parser");
const cookieparser = require("cookie-parser");
const { authenticateToken } = require("./middleware/authMiddleware");
const Student = require("./models/Student");
const studentRoutes = require("./routes/studentRoutes");
const courseRoutes = require("./routes/courseRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const adminRoutes = require("./routes/adminRoutes");
const userRoutes = require("./routes/userRoutes");
const Assignment = require("./models/Assignment");
const completedassignments = require("./routes/completedAssignmentRoutes");
const {
  estimateFinalGrades,
} = require("./controllers/completedassignmentscontroller");
const emailRoutes = require("./routes/appMailRoutes");
const gradeRoutes = require("./routes/gradeRoutes");

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
// Middleware
app.use(bodyParser.json());
app.use(cookieparser());

mongoose.connect(process.env.ATLAS_URI);

// Use authenticateToken middleware for protected routes
app.use("/students", authenticateToken, studentRoutes);
app.use("/courses", authenticateToken, courseRoutes);
app.use("/assignments", authenticateToken, assignmentRoutes);
app.use("/completed-assignments", authenticateToken, completedassignments);
app.use("/grades", authenticateToken, gradeRoutes);
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);
//email
app.use("/email", emailRoutes);

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}/`);
});

// Route handler for fetching user info
app.get("/userinfo", authenticateToken, (req, res) => {
  try {
    const user = req.user;
    res.json({ user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
