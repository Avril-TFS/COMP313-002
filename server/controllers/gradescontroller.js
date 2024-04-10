const Course = require("../models/Course");
const Assignment = require("../models/Assignment");

// function to get all grades from a course's assignments for a student
const getGradesForStudent = async (req, res) => {
  try {
    // Retrieve the student ID from the request parameters
    const { studentId } = req.params;
    // Retrieve the course ID from the request parameters
    const { courseId } = req.params;
    // Query the Assignment Database to retrieve all assignments for the course
    const assignments = await Assignment.find({
      course: courseId,
      student: studentId,
    });
    //console.log("Assignments for the course:", assignments);
    // Check if the course has any assignments
    if (assignments.length === 0) {
      return res
        .status(404)
        .json({ message: "No assignments found for the course" });
    }
    // Get all grades for the student from the assignments in the course where assignment.completed = true
    const grades = [];
    for (const assignment of assignments) {
      const completedAssignment = await Assignment.findOne({
        student: studentId,
        _id: assignment._id,
        completed: true,
      });
      if (completedAssignment !== null) {
        grades.push(completedAssignment);
      }
    }
    //console.log("Grades for student:", grades);
    // Return the grades
    res.status(200).json(grades);
  } catch (error) {
    // Handle any errors that occur during the process
    console.error("Error retrieving grades for the student:", error);
    res.status(500).json({ message: "Failed to fetch grades for the student" });
  }
};

module.exports = { getGradesForStudent };
