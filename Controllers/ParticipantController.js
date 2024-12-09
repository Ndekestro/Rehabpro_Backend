// controllers/participantController.js

const db = require('../db');

// Create Participant
exports.addParticipant = (req, res) => {
  const { user_id, rehabilitation_program, goal } = req.body;

  const query = 'INSERT INTO participants (user_id, rehabilitation_program, goal) VALUES (?, ?, ?)';
  db.query(query, [user_id, rehabilitation_program, goal], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error adding participant' });
    }
    res.status(201).json({ message: 'Participant added successfully' });
  });
};

// Get Participant by ID
exports.getParticipant = (req, res) => {
  const participantId = req.params.id;

  const query = 'SELECT * FROM participants WHERE id = ?';
  db.query(query, [participantId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'Participant not found' });
    }
    res.status(200).json({ participant: results[0] });
  });
};

// Update Participant Progress
exports.updateParticipantProgress = (req, res) => {
  const participantId = req.params.id;
  const { progress } = req.body;

  const query = 'UPDATE participants SET progress = ? WHERE id = ?';
  db.query(query, [progress, participantId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating progress' });
    }
    res.status(200).json({ message: 'Progress updated successfully' });
  });
};

// Update Participant (rehabilitation program and goal)
exports.updateParticipant = (req, res) => {
  const participantId = req.params.id;
  const { rehabilitation_program, goal } = req.body;

  const query = 'UPDATE participants SET rehabilitation_program = ?, goal = ? WHERE id = ?';
  db.query(query, [rehabilitation_program, goal, participantId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating participant' });
    }
    res.status(200).json({ message: 'Participant updated successfully' });
  });
};

// Delete Participant
exports.deleteParticipant = (req, res) => {
  const participantId = req.params.id;

  const query = 'DELETE FROM participants WHERE id = ?';
  db.query(query, [participantId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting participant' });
    }
    res.status(200).json({ message: 'Participant deleted successfully' });
  });
};
