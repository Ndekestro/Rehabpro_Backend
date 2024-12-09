// routes/goalRoutes.js

const express = require('express');
const router = express.Router();

// Import goal controller
const goalController = require('../Controllers/GoalController');

// Set Goal
router.post('/', goalController.setGoal);

// Get Goal by ID
router.get('/:id', goalController.getGoal);

// Update Goal Status
router.put('/:id', goalController.updateGoalStatus);

// Delete Goal
router.delete('/:id', goalController.deleteGoal);

module.exports = router;
