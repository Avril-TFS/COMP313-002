// routes/adminRoutes.js

const express = require("express");
const { ObjectId } = require("mongodb");
const Admin = require("../models/Admin.js");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { authenticateToken } = require("../middleware/authMiddleware"); // Import the authentication middleware
const router = express.Router();

// Get all admins
router.get('/', async (req, res) => {
  try {
    console.log('Request to get all admins:', req.user); // Log the user information
    const admins = await Admin.find();
    res.json(admins);
    //console.log('admin',admins)
  } catch (error) {
    console.error('Error getting all admins:', error.message);
    res.status(500).json({ message: error.message });
  }
});

// Get a specific admin
router.get('/:id', async (req, res) => {
  try {
    const admin = await Admin.findById(req.params.id);
    res.json(admin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new admin
router.post('/', async (req, res) => {
  const admin = new Admin({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password, // Remember to hash the password before storing it
  });

  try {
    const newAdmin = await admin.save();
    res.status(201).json(newAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update an admin
router.patch('/:id', async (req, res) => {
  try {
    const updatedAdmin = await Admin.findByIdAndUpdate(
      req.params.id,
      {
        $set: {
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          email: req.body.email,
          password: req.body.password, // Remember to hash the password before storing it
        },
      },
      { new: true }
    );
    res.json(updatedAdmin);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete an admin
router.delete('/:id', async (req, res) => {
  try {
    const deletedAdmin = await Admin.findByIdAndDelete(req.params.id);
    res.json(deletedAdmin);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Route to handle admin login
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if the admin with the provided email exists
    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Compare the provided password with the hashed password in the database
    const passwordMatch = await bcrypt.compare(password, admin.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create a JWT token for authentication
    const token = jwt.sign({ adminId: admin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Signup endpoint with logging
router.post('/signup', async (req, res) => {
  console.log('Received signup request:', req.body);

  try {
    const { email, password, firstName, lastName } = req.body;

    // Check if the admin with the provided email already exists
    const existingAdmin = await Admin.findOne({ email });

    if (existingAdmin) {
      return res.status(400).json({ message: 'Admin with this email already exists' });
    }

    // Hash the password before saving it to the database
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new admin
    const newAdmin = new Admin({
      email,
      password: hashedPassword,
      firstName,
      lastName
    });

    // Save the new admin to the database
    await newAdmin.save();

    // Create a JWT token for authentication
    const token = jwt.sign({ adminId: newAdmin._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    
    res.status(201).json({ message: 'Admin signed up successfully', token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
