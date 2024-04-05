const Profile = require("../models/Profile");

// Get all profiles
const getAllProfiles = async (req, res) => {
  try {
    const profiles = await Profile.find();
    res.json(profiles);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get profile by ID
const getProfileById = async (req, res) => {
  try {
    const profile = await Profile.findById(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create a new profile
const createProfile = async (req, res) => {
  try {
    const newProfile = new Profile(req.body);
    const profile = await newProfile.save();
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Update profile by ID
const updateProfileById = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete profile by ID
const deleteProfileById = async (req, res) => {
  try {
    const profile = await Profile.findByIdAndRemove(req.params.id);
    if (!profile) {
      return res.status(404).json({ error: "Profile not found" });
    }
    res.json({ message: "Profile deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  getAllProfiles,
  getProfileById,
  createProfile,
  updateProfileById,
  deleteProfileById,
};
