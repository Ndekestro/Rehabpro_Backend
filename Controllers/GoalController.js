// controllers/goalController.js

const db = require('../db');

// Set Goal
exports.setGoal = (req, res) => {
  const { participant_id, goal_name, target_date } = req.body;

  const query = 'INSERT INTO goals (participant_id, goal_name, target_date) VALUES (?, ?, ?)';
  db.query(query, [participant_id, goal_name, target_date], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error setting goal' });
    }
    res.status(201).json({ message: 'Goal set successfully' });
  });
};

// Get Goal by ID
exports.getGoal = (req, res) => {
  const goalId = req.params.id;

  const query = 'SELECT * FROM goals WHERE id = ?';
  db.query(query, [goalId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'Goal not found' });
    }
    res.status(200).json({ goal: results[0] });
  });
};

// Update Goal Status
exports.updateGoalStatus = (req, res) => {
  const goalId = req.params.id;
  const { status } = req.body;

  const query = 'UPDATE goals SET status = ? WHERE id = ?';
  db.query(query, [status, goalId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating goal status' });
    }
    res.status(200).json({ message: 'Goal status updated successfully' });
  });
};

// Delete Goal
exports.deleteGoal = (req, res) => {
  const goalId = req.params.id;

  const query = 'DELETE FROM goals WHERE id = ?';
  db.query(query, [goalId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting goal' });
    }
    res.status(200).json({ message: 'Goal deleted successfully' });
  });
};
