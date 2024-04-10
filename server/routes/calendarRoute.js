//server/routes/calendarRoute.js

const express = require("express");
const router = require('express').Router();
const {google, GoogleApis} = require('googleapis');

const GOOGLE_CLIENT_ID = '114259769650-eh5tmoeistfiigle8o5u0susuoe3s0d9.apps.googleusercontent.com';
const GOOGLE_CLIENT_SECRET = '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';

const oauth2Client = new google.auth.OAuth2(
    GOOGLE_CLIENT_ID,
    GOOGLE_CLIENT_SECRET,
    'http://localhost:3000/calendar'
);

router.get("/", async (req, res, next) => {
    res.send({message: "Hello from the calendar route!"})
  });

router.post('/create-calendar-token', async (req, res, next) => {
  try{
    const {credential} = req.body;
    console.log(credential);
    const response = await oauth2Client.getToken(credential);
    res.send(response);
  }catch(error){
    next(error)
  }
});

module.exports = router;