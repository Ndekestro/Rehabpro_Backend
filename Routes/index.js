// routes/index.js

const express = require('express');
const router = express.Router();

// Import route files
const userRoutes = require('./userRoutes');
const participantRoutes = require('./participantRoutes');
const goalRoutes = require('./goalRoutes');
const outcomeRoutes = require('./outcomeRoutes');

// Use the individual route files
router.use('/users', userRoutes); // All user-related routes
router.use('/participants', participantRoutes); // All participant-related routes
router.use('/goals', goalRoutes); // All goal-related routes
router.use('/outcomes', outcomeRoutes); // All outcome-related routes

module.exports = router;
