// routes/completedAssignments.js
const express = require("express");
const router = express.Router();
const {
  getCompletedAssignments,
  markAssignmentAsCompleted,
  markAssignmentAsIncomplete,
  getCompletedAssignmentsForStudent,
} = require("../controllers/completedassignmentscontroller");

// Route to fetch completed assignments
router.get("/", async (req, res) => {
  getCompletedAssignments(req, res);
});

router.get("/:studentId", async (req, res) => {
  //console.log("req.params.studentId", req.params.studentId);
  getCompletedAssignmentsForStudent(req, res);
});

// Route to mark an assignment as completed
router.post("/:id/mark-completed", async (req, res) => {
  markAssignmentAsCompleted(req, res);
});

// Route to update assignment status to complete = false
router.put("/:id/mark-incomplete", async (req, res) => {
  markAssignmentAsIncomplete(req, res);
});

module.exports = router;

// module.exports = router;

// // routes/completedAssignments.js
// const express = require("express");
// const router = express.Router();
// const CompletedAssignment = require("../models/CompletedAssignment");

// // Route to fetch completed assignments
// router.get("/", async (req, res) => {
//   try {
//     // Fetch completed assignments from the database
//     const completedAssignments = await CompletedAssignment.find();
//     res.status(200).json(completedAssignments);
//   } catch (error) {
//     console.error("Error fetching completed assignments:", error);
//     res.status(500).json({ message: "Failed to fetch completed assignments" });
//   }
// });

// // Route to mark an assignment as completed
// router.post("/:assignmentId/mark-completed", async (req, res) => {
//   try {
//     const { assignmentId } = req.params;
//     // Create a new CompletedAssignment instance
//     const completedAssignment = new CompletedAssignment({ assignment: assignmentId });
//     // Save the completed assignment to the database
//     await completedAssignment.save();
//     res.status(200).json({ message: "Assignment marked as completed successfully" });
//   } catch (error) {
//     console.error("Error marking assignment as completed:", error);
//     res.status(500).json({ message: "Failed to mark assignment as completed" });
//   }
// });

// module.exports = router;
