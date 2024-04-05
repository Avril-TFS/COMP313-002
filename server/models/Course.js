// models/Course.js

const mongoose = require("mongoose");

const courseSchema = new mongoose.Schema({
  name: { type: String, required: true },
  professor: { type: String, required: true },
  schedules: [
    {
      day: { type: String, required: true },
      startTime: { type: String, required: true },
      endTime: { type: String, required: true },
      // type: mongoose.Schema.Types.ObjectId,
      // ref: 'Schedule' 
    },
  ],
  startDate: { type: Date },
  endDate: { type: Date },
  assignments: [{ type: mongoose.Schema.Types.ObjectId, ref: "Assignment" }],
  memo: { type: String, default: "" }
});
const Course = mongoose.model("Course", courseSchema);

module.exports = Course;
