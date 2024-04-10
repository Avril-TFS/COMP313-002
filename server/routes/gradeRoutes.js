// routes/gradeRoutes.js
const express = require("express");
const router = express.Router();
const CompletedAssignment = require("../models/CompletedAssignment");
const Grade = require("../models/Grade");
const Course = require("../models/Course");
const Assignment = require("../models/Assignment");
const { getGradesForStudent } = require("../controllers/gradescontroller");

// Route to estimate final grades
router.post("/estimate-grades", async (req, res) => {
  getGradesForStudent(req, res);
});

// Route to estimate final grades
router.get("/estimate-grades/:studentId/:courseId", async (req, res) => {
  getGradesForStudent(req, res);
});

module.exports = router;
