//controllers/completedassignmentscontroller.js
const Assignment = require("../models/Assignment");
const Grade = require("../models/Grade");

const getCompletedAssignments = async (req, res) => {
  try {
    // Query the Assignment Database to retrieve completed assignments
    const completedAssignments = await Assignment.find({ completed: true });
    if (completedAssignments.length === 0) {
      return res
        .status(404)
        .json({ message: "No completed assignments found" });
    }
    // Return the completed assignments
    res.status(200).json(completedAssignments);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error retrieving completed assignments:", error);
    res.status(500).json({ message: "Failed to fetch completed assignments" });
  }
};

const getCompletedAssignmentsForStudent = async (req, res) => {
  try {
    // Retrieve the student ID from the request parameters
    const { studentId } = req.params;
    // Query the Assignment Database to retrieve completed assignments for the student
    const completedAssignments = await Assignment.find({
      student: studentId,
      completed: true,
    });
    //console.log("completedAssignments", completedAssignments);
    if (completedAssignments.length === 0) {
      return res
        .status(404)
        .json({ message: "No completed assignments found for the student" });
    }
    // Return the completed assignments
    res.status(200).json(completedAssignments);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error(
      "Error retrieving completed assignments for the student:",
      error
    );
    res.status(500).json({
      message: "Failed to fetch completed assignments for the student",
    });
  }
};

//function to mark an assignment as completed
const markAssignmentAsCompleted = async (req, res) => {
  try {
    // Retrieve the assignment ID from the request parameters
    const { id } = req.params;
    // Query the Assignment Database to find the assignment by ID
    const assignment = await Assignment.findById(id);
    // Check if the assignment exists
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    // Update the assignment status to completed
    assignment.completed = true;
    // Save the updated assignment
    await assignment.save();
    // Return a success message
    res
      .status(201)
      .json({ message: "Assignment marked as completed successfully" });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error marking assignment as completed:", error);
    res.status(500).json({ message: "Failed to mark assignment as completed" });
  }
};

//function to mark an assignment as incomplete
const markAssignmentAsIncomplete = async (req, res) => {
  try {
    // Retrieve the assignment ID from the request parameters
    const { id } = req.params;
    // Query the Assignment Database to find the assignment by ID
    const assignment = await Assignment.findById(id);
    // Check if the assignment exists
    if (!assignment) {
      return res.status(404).json({ message: "Assignment not found" });
    }
    // Update the assignment status to incomplete
    assignment.completed = false;
    // Save the updated assignment
    await assignment.save();
    // Return a success message
    res
      .status(200)
      .json({ message: "Assignment marked as incomplete successfully" });
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error marking assignment as incomplete:", error);
    res
      .status(500)
      .json({ message: "Failed to mark assignment as incomplete" });
  }
};

// Function to estimate final grades for a student
const estimateFinalGrades = async (studentId) => {
  try {
    // Get all completed assignments for the student
    const completedAssignments = await Assignment.find({
      student: studentId,
      completed: true,
    });

    // Calculate total grade for each course
    const courseGrades = {};
    for (const assignment of completedAssignments) {
      const grade = await Grade.findOne({
        assignment: assignment._id,
        student: studentId,
      });
      if (grade) {
        const courseId = assignment.course;
        if (!courseGrades[courseId]) {
          courseGrades[courseId] = {
            totalGrade: 0,
            totalWeight: 0,
          };
        }
        courseGrades[courseId].totalGrade += grade.grade * assignment.weight;
        courseGrades[courseId].totalWeight += assignment.weight;
      }
    }

    // Calculate final grade for each course
    const finalGrades = {};
    for (const courseId in courseGrades) {
      const { totalGrade, totalWeight } = courseGrades[courseId];
      const finalGrade = (totalGrade / totalWeight) * 100;
      finalGrades[courseId] = finalGrade.toFixed(2);
    }

    return finalGrades;
  } catch (error) {
    console.error("Error estimating final grades:", error);
    throw new Error("Failed to estimate final grades");
  }
};

module.exports = {
  getCompletedAssignments,
  markAssignmentAsCompleted,
  markAssignmentAsIncomplete,
  getCompletedAssignmentsForStudent,
  estimateFinalGrades,
};

