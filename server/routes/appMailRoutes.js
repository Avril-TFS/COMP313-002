//email notification system route
const express = require("express");
const router = express.Router();
const appMailController = require("../controllers/appMailController");


//email sending 
router.post("/sendEmail",appMailController.sendEmail)

module.exports = router;