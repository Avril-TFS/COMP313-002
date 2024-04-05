//userRoutes.js
const express = require("express");
const ObjectId = require("mongodb").ObjectId;
const Student = require("../models/Student.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const router = express.Router();

const tokenBlacklist = [];

// Middleware to check if the token is blacklisted
const checkTokenBlacklist = (req, res, next) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (token && tokenBlacklist.includes(token)) {
    return res.status(401).json({ message: "Token revoked" });
  }
  // Token is not blacklisted, continue processing the request
  next();
};

// Logout route
router.post("/logout", checkTokenBlacklist, (req, res) => {
  const token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];
  if (!token) {
    return res.status(401).json({ message: "Invalid token" });
  }
  // Add the token to the blacklist
  tokenBlacklist.push(token);
  res.json({ message: "Logout successful" });
});

// Signup route for students
router.post("/signup", async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    // Check if the email is already registered
    const existingStudent = await Student.findOne({ email });
    if (existingStudent) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new student
    const newStudent = new Student({
      firstName,
      lastName,
      email,
      password: hashedPassword,
    });

    // Save the new student to the database
    const savedStudent = await newStudent.save();

    // Create a JWT token for authentication
    const token = jwt.sign(
      { studentId: savedStudent._id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Student signed up successfully",
      token,
      expiresIn: 3600,
      user: {
        id: savedStudent._id,
        firstName: savedStudent.firstName,
        lastName: savedStudent.lastName,
        email: savedStudent.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login route for students
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the student exists
    const student = await Student.findOne({ email });
    if (!student) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Compare passwords
    const isPasswordValid = await bcrypt.compare(password, student.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Generate a JWT token for authentication
    const token = jwt.sign({ userId: student._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    // Creating refresh token not that expiry of refresh
    //token is greater than the access token

    const refreshToken = jwt.sign(
      {
        userId: student._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );

    // Assigning refresh token in http-only cookie
    res.cookie("jwt", refreshToken, {
      httpOnly: true,
      sameSite: "None",
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    });

    // Send the token in the response
    res.json({
      token,
      user: {
        id: student._id,
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
      },
    }); // expiresIn is in seconds (1 hour in this example)
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/refresh", (req, res) => {
  if (req.cookies?.jwt) {
    // Destructuring refreshToken from cookie
    const refreshToken = req.cookies.jwt;

    // Verifying refresh token
    jwt.verify(
      refreshToken,
      process.env.REFRESH_TOKEN_SECRET,
      (err, decoded) => {
        if (err) {
          // Wrong Refesh Token
          return res.status(406).json({ message: "Unauthorized" });
        } else {
          const email = decoded.userId;
          // Correct token we send a new access token
          const accessToken = jwt.sign(
            {
              email: email,
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
              expiresIn: "10m",
            }
          );
          return res.json({ accessToken });
        }
      }
    );
  } else {
    return res.status(406).json({ message: "Unauthorized" });
  }
});

module.exports = router;
