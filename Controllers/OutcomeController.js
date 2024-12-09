// controllers/outcomeController.js

const db = require('../db');

// Record Outcome
exports.recordOutcome = (req, res) => {
  const { participant_id, session_date, physical_score, psychological_score, social_score, notes } = req.body;

  const query = 'INSERT INTO outcomes (participant_id, session_date, physical_score, psychological_score, social_score, notes) VALUES (?, ?, ?, ?, ?, ?)';
  db.query(query, [participant_id, session_date, physical_score, psychological_score, social_score, notes], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error recording outcome' });
    }
    res.status(201).json({ message: 'Outcome recorded successfully' });
  });
};

// Get Outcome by ID
exports.getOutcome = (req, res) => {
  const outcomeId = req.params.id;

  const query = 'SELECT * FROM outcomes WHERE id = ?';
  db.query(query, [outcomeId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'Outcome not found' });
    }
    res.status(200).json({ outcome: results[0] });
  });
};

// Update Outcome
exports.updateOutcome = (req, res) => {
  const outcomeId = req.params.id;
  const { physical_score, psychological_score, social_score, notes } = req.body;

  const query = 'UPDATE outcomes SET physical_score = ?, psychological_score = ?, social_score = ?, notes = ? WHERE id = ?';
  db.query(query, [physical_score, psychological_score, social_score, notes, outcomeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating outcome' });
    }
    res.status(200).json({ message: 'Outcome updated successfully' });
  });
};

// Delete Outcome
exports.deleteOutcome = (req, res) => {
  const outcomeId = req.params.id;

  const query = 'DELETE FROM outcomes WHERE id = ?';
  db.query(query, [outcomeId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting outcome' });
    }
    res.status(200).json({ message: 'Outcome deleted successfully' });
  });
};
