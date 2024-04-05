// models/Grade.js

const mongoose = require("mongoose");

const gradeSchema = new mongoose.Schema({
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
  grade: { type: Number, required: true, min: 0, max: 100 },
});

const Grade = mongoose.model("Grade", gradeSchema);

module.exports = Grade;
