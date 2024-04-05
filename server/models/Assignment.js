// models/Assignment.js
const mongoose = require("mongoose");

const assignmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  dueDate: { type: Date, required: true },
  course: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Course",
    required: true,
  },
  grade: { type: Number, default: 0, required: false, max: 100 },
  weight: { type: Number, default: 1, required: false, max: 1, min: 0 },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  completed: { type: Boolean, default: false }, // New field for tracking completion status
  memo: { type: String, default: "" },  // New field for memo space
  priority: { type: Number, default: 0 } //New field for priority 
});

const Assignment = mongoose.model("Assignment", assignmentSchema);

module.exports = Assignment;
