// server.cjs
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

// Change the import statement in server.cjs
import('./models/User.cjs').then((module) => {
  const User = module.default;
  
  const app = express();

  // Enable CORS
  app.use(cors());

  // Connect to MongoDB
  mongoose
    .connect('mongodb://adminUser:adminPassword@localhost:27017/admin', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('MongoDB connected successfully');
    })
    .catch((error) => {
      console.error('MongoDB connection error:', error);
    });

  // Middleware
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(
    session({
      secret: 'your-secret-key',
      resave: true,
      saveUninitialized: true,
    })
  );
  app.use(passport.initialize());
  app.use(passport.session());

  // Passport configuration
  passport.use(new LocalStrategy(User.authenticate()));
  passport.serializeUser(User.serializeUser());
  passport.deserializeUser(User.deserializeUser());

  // Routes
  app.post('/api/register', (req, res) => {
    User.register(
      new User({ username: req.body.username }),
      req.body.password,
      (err, user) => {
        if (err) {
          if (err.name === 'UserExistsError') {
            console.error('Registration error:', err.message);
            return res.status(400).json({ error: 'Username is already registered' });
          }

          console.error('Registration error:', err);
          return res.status(500).json({ error: 'Internal server error' });
        }

        // No need to authenticate here
        res.json({ success: true, user });
      }
    );
  });

  app.post('/api/login', passport.authenticate('local'), (req, res) => {
    res.json({ success: true, user: req.user });
  });

  app.get('/api/logout', (req, res) => {
    req.logout();
    res.json({ success: true });
  });

  app.get('/api/user', (req, res) => {
    if (req.isAuthenticated()) {
      res.json({ user: req.user });
    } else {
      res.json({ user: null });
    }
  });

  // Error handling middleware for unhandled errors
  app.use((err, req, res, next) => {
    console.error('Unhandled error:', err);
    res.status(500).json({ error: 'Internal server error' });
  });

  // Start the server
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});



