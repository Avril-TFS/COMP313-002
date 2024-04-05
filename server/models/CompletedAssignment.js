// models/CompletedAssignment.js
const mongoose = require("mongoose");

const completedAssignmentSchema = new mongoose.Schema({
  assignment: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Assignment",
    required: true,
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  completedDate: { type: Date, default: Date.now },
});

const CompletedAssignment = mongoose.model(
  "CompletedAssignment",
  completedAssignmentSchema
);

module.exports = CompletedAssignment;

