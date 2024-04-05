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
const { estimateFinalGrades } = require("./controllers/completedassignmentscontroller");


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
app.use("/admin", adminRoutes);
app.use("/users", userRoutes);

// Error handling middleware
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).send("Uh oh! An unexpected error occurred.");
});

// Route handler for marking assignments as completed
app.post(
  "/completed-assignments/:id/mark-completed",
  authenticateToken,
  async (req, res) => {
  try {
    const { id } = req.params;
    // Find the assignment by ID and update its 'completed' field to true
      const assignment = await Assignment.findByIdAndUpdate(
        id,
        { completed: true },
        { new: true }
      );
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.status(200).json({ message: `Assignment ${id} marked as completed` });
  } catch (error) {
    console.error(error);
    res
        .status(500)
        .json({ message: "Failed to mark assignment as completed" });
}
  }
);
const PORT = process.env.PORT || 5050;
app.listen(PORT, () => {
  console.log(`Server is running on port: http://localhost:${PORT}/`);
});

// Route handler for estimating grades
app.get("/estimate-grades", authenticateToken, async (req, res) => {
  try {
    // Retrieve the student ID from the authenticated user
    const studentId = req.user.id;

    // Call the estimateFinalGrades function from completedassignmentscontroller
    const estimatedGrades = await estimateFinalGrades(studentId);

    // Send the estimated grades as a response
    res.status(200).json({ message: "Estimated grades calculated successfully", estimatedGrades });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to calculate estimated grades" });
  }
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