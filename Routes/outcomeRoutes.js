// routes/outcomeRoutes.js

const express = require('express');
const router = express.Router();

// Import outcome controller
const outcomeController = require('../Controllers/OutcomeController');

// Record Outcome
router.post('/', outcomeController.recordOutcome);

// Get Outcome by ID
router.get('/:id', outcomeController.getOutcome);

// Update Outcome
router.put('/:id', outcomeController.updateOutcome);

// Delete Outcome
router.delete('/:id', outcomeController.deleteOutcome);

module.exports = router;
