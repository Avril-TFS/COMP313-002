// // routes/studentRoutes.js
// import express from "express";
// import { ObjectId } from "mongodb";
// import Student from "../models/Student.js";

const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  createStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentcontroller");

// Get all students
router.get("/", async (req, res) => {
  getAllStudents(req, res);
});

// Get a specific student
router.get("/:id", async (req, res) => {
  getStudentById(req, res);
});

// Create a new student
router.post("/", async (req, res) => {
  createStudent(req, res);
});

// Update a student
router.patch("/:id", async (req, res) => {
  updateStudent(req, res);
});

// Delete a student by ID
router.delete("/:id", async (req, res) => {
  deleteStudent(req, res);
});

module.exports = router;
