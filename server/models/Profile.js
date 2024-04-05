const mongoose = require("mongoose");

// Define the Profile schema
// Define the Profile schema
const profileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  studentid: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
  },
});

// Define the Profile model using the schema
const Profile = mongoose.model("Profile", profileSchema);

// Export the Profile model
module.exports = Profile;
