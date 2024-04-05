const Student = require("../models/Student");

// Import the necessary modules and models

// Controller to get all students
const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Controller to get a single student by ID
const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Controller to create a new student
const createStudent = async (req, res) => {
  try {
    const student = new Student({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password, // Remember to hash the password before storing it
      courses: [],
    });
    await student.save();
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: "Error Creating Student" });
  }
};

// Controller to update a student by ID
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );

    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    await student.save();
    //console.log("student", student);
    res.status(201).json({
      user: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Controller to delete a student by ID
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).json({ error: "Student not found" });
    }
    res.json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error when deleting" });
  }
};

// Export the controllers
module.exports = {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
};
