// routes/gradeRoutes.js
const express = require("express");
const router = express.Router();
const CompletedAssignment = require("../models/CompletedAssignment");
const Grade = require("../models/Grade");
const Course = require("../models/Course");
const Assignment = require("../models/Assignment");

// Route to estimate final grades
router.post("/estimate-grades", async (req, res) => {
  try {
    const { studentId } = req.body;

    // Get all completed assignments for the student
    const completedAssignments = await CompletedAssignment.find({
        student: studentId,
      }).populate({
        path: "assignment",
        select: "course",
      });

    // Calculate total grade for each course
    const courseGrades = {};
    for (const completedAssignment of completedAssignments) {
      const assignment = completedAssignment.assignment;
      if (assignment) {
        const courseId = assignment.course;
        const course = await Course.findById(courseId);
        if (!courseGrades[courseId]) {
          courseGrades[courseId] = {
            totalGrade: 0,
            totalWeight: 0,
          };
        }
        const grade = await Grade.findOne({
          assignment: assignment._id,
          student: studentId,
        });
        if (grade) {
          courseGrades[courseId].totalGrade += grade.grade * assignment.weight;
          courseGrades[courseId].totalWeight += assignment.weight;
        }
      }
    }

    // Calculate final grade for each course
    const finalGrades = {};
    for (const courseId in courseGrades) {
      const { totalGrade, totalWeight } = courseGrades[courseId];
      const finalGrade = (totalGrade / totalWeight) * 100;
      finalGrades[courseId] = finalGrade.toFixed(2);
    }

    // Respond with estimated final grades
    res.status(200).json(finalGrades);
  } catch (error) {
    console.error("Error estimating final grades:", error);
    res.status(500).json({ message: "Failed to estimate final grades" });
  }
});

module.exports = router;