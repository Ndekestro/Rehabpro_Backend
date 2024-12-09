// routes/participantRoutes.js

const express = require('express');
const router = express.Router();

// Import participant controller
const participantController = require('../Controllers/ParticipantController');

// Add a Participant
router.post('/', participantController.addParticipant);

// Get Participant by ID
router.get('/:id', participantController.getParticipant);

// Update Participant (rehabilitation program and goal)
router.put('/:id', participantController.updateParticipant);

// Update Participant Progress
router.put('/:id/progress', participantController.updateParticipantProgress);

// Delete Participant
router.delete('/:id', participantController.deleteParticipant);

module.exports = router;
