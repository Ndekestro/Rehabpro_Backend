const express = require('express');
const router = express.Router();
const programController = require('../controllers/ProgramControoler');

// Program routes
router.post('/', programController.createProgram);           // Create a program
router.get('/', programController.getAllPrograms);           // Get all programs
router.put('/:id', programController.updateProgram);         // Update a program
router.delete('/:id', programController.deleteProgram);      // Delete a program
router.get('/role', programController.getProgramsByRole);    // Get programs by role
router.get('/professionals', programController.getAllProfessionals);
router.put('/updateprofessionals/:id', programController.updateProgrambyProfessional)
router.post('/addparticipant', programController.addParticipant);
router.post('/removeparticipant', programController.removeParticipant);
router.get('/participants', programController.getAllParticipants);

module.exports = router;
