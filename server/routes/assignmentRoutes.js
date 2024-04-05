// routes/assignmentRoutes.js
// import express from "express";
// import { ObjectId } from "mongodb";
// import Assignment from "../models/Assignment.js";

const express = require("express");
const Student = require("../models/Student");
const Assignment = require("../models/Assignment");
const Course = require("../models/Course");

const router = express.Router();

// Route handler for marking assignments as completed
// router.post("/:id/mark-completed", async (req, res) => {
//   try {
//     const { id } = req.params;
//     // Perform logic to mark the assignment with the specified ID as completed
//     // For example, update the assignment status in the database
//     const assignment = await Assignment.findById(id);
//     if (!assignment) {
//       return res.status(404).json({ message: "Assignment not found" });
//     }
//     // Assuming there's a 'completed' field in the assignment schema
//     assignment.completed = true;
//     await assignment.save();
//     res.status(200).json({ message: `Assignment ${id} marked as completed` });
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: "Failed to mark assignment as completed" });
//   }
// });

router.post("/:id/mark-completed", async (req, res) => {
  try {
    const { id } = req.params;

    // Find the assignment by ID
    const assignment = await Assignment.findById(id);

    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Update the 'completed' field to true
    assignment.completed = true;

    // Save the updated assignment
    await assignment.save();

    res.status(200).json({ message: `Assignment ${id} marked as completed` });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to mark assignment as completed" });
  }
});

// Get all assignments
router.get("/", async (req, res) => {
  try {
    //console.log("headers",req.headers)
    const assignments = await Assignment.find();
    if (assignments.length === 0) {
      return res.status(404).json({ message: "No assignments found" });
    }
    res.status(201).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get a specific assignment  //e.g) localhost:5050/assignments/65debb6537494b5be4a7dfc0
router.get("/:id", async (req, res) => {
  try {
    const assignment = await Assignment.findById(req.params.id);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    res.json(assignment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new assignment
router.post("/", async (req, res) => {
  const assignment = new Assignment({
    name: req.body.name,
    dueDate: req.body.dueDate,
    course: req.body.course,
    grade: req.body.grade,
    weight: req.body.weight,
    student: req.body.student,
    completed: req.body.completed,  //new field
    memo:req.body.memo,             //new field
    priority:req.body.priority      //new field
  });

  try {
    const newAssignment = await assignment.save();
    res.status(201).json(newAssignment);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Route to update an assignment
router.patch("/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;
  const { weight, grade, dueDate, name ,priority,completed,memo} = req.body;

  try {
    // Check if the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Update the assignment fields
    if (weight !== undefined) {
      assignment.weight = weight;
    }

    if (grade !== undefined) {
      assignment.grade = grade;
    }

    if (dueDate !== undefined) {
      assignment.dueDate = dueDate;
    }

    if (name !== undefined) {
      assignment.name = name;
    }

    if(completed!== undefined){
      assignment.completed = completed
    }

    if(memo!== undefined){
      assignment.memo = memo
    }

    if(priority!== undefined){
      assignment.priority = priority
    }

    // Save the updated assignment to the database
    await assignment.save();

    res.status(200).json({ message: "Assignment updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
// Delete an assignment by Id, Also delete that assignment from courses with it and students with it
router.delete("/:assignmentId", async (req, res) => {
  const { assignmentId } = req.params;

  try {
    // Check if the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Delete the assignment from courses
    await Course.updateMany(
      { assignments: assignmentId },
      { $pull: { assignments: assignmentId } }
    );

    // Delete the assignment from students
    await Student.updateMany(
      { assignments: assignmentId },
      { $pull: { assignments: assignmentId } }
    );

    // Delete the assignment
    await Assignment.findByIdAndDelete(assignmentId);

    res.json({ message: "Assignment deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to add an assignment
router.post("/add-assignment", async (req, res) => {
  const { name, dueDate, courseId, weight, studentId, grade , completed, memo,priority} = req.body;

  try {
    // Check if the course exists
    const course = await Course.findById(courseId);

    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Check if the student is enrolled in the course
    if (!student.courses.includes(courseId.toString())) {
      return res
        .status(400)
        .json({ message: "Student is not enrolled in the course" });
    }

    // Create the assignment
    const assignment = new Assignment({
      name,
      dueDate,
      course: courseId,
      weight: weight || 1, // Default weight is set to 1 if not provided
      student: studentId,
      grade: grade || 0,
      completed: completed || false,
      memo: memo || "",
      priority: priority || 0
    });
    course.assignments.push(assignment);
    student.assignments.push(assignment);

    await assignment.save();
    await student.save();
    await course.save();

    return res.status(201).json({
      message: "Assignment added successfully",
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

router.post("/:assignmentId/add-grade", async (req, res) => {
  const { assignmentId } = req.params;
  const { studentId, score } = req.body;

  try {
    // Check if the assignment exists
    const assignment = await Assignment.findById(assignmentId);
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(400)
        .json({ message: `Student with ID ${studentId} not found` });
    }

    // Check if the student is enrolled in the course associated with the assignment
    const course = await Course.findById(assignment.course);
    if (!course || !student.courses.includes(course._id.toString())) {
      return res
        .status(400)
        .json({ message: "Student is not enrolled in the course" });
    }

    // Update or add the grade for the student in the assignment
    assignment.grade = score;

    // Save the updated assignment to the database
    await assignment.save();

    res.status(201).json({ message: "Grade added or updated successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all assignments of a student
router.get("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Get all assignments associated with the student
    const assignments = await Assignment.find({ student: studentId });
    if (assignments.length === 0) {
      return res
        .status(404)
        .json({ message: "No assignments found for the student" });
    }

    res.status(200).json(assignments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete all assignments of a student
router.delete("/student/:studentId", async (req, res) => {
  try {
    const { studentId } = req.params;

    // Check if the student exists
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Delete all assignments associated with the student
    await Assignment.deleteMany({ student: studentId });

    res.json({ message: "All assignments deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
