// controllers/userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db'); // Your MySQL connection

// JWT secret hardcoded here (NOT recommended for production)
const JWT_SECRET = 'c23db8c3f447c41e4e6504c8f546326a533b7ec4a86fa0e4dcc78cb4ee56c75364c7622ec30f4858049e4a7b2d39d53a113a47e17e50978474dc5cba167cc1aa';

// User Registration (Create User)
exports.registerUser = (req, res) => {
  const { name, email, username, password, role } = req.body;

  // Hash the password
  bcrypt.hash(password, 10, (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ error: 'Error hashing password' });
    }

    // Insert the new user into the database
    const query = 'INSERT INTO users (name, email, username, password, role) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [name, email, username, hashedPassword, role], (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error saving user' });
      }
      res.status(201).json({ message: 'User registered successfully' });
    });
  });
};


exports.loginUser = (req, res) => {
  const { identifier, password } = req.body; 

  const query = 'SELECT * FROM users WHERE username = ? OR email = ?';
  db.query(query, [identifier, identifier], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });
      if (results.length === 0) return res.status(404).json({ message: 'User not found' });

      const user = results[0];

      try {
          // Compare plaintext password with the hashed password
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
              return res.status(401).json({ message: 'Invalid password' });
          }

          // Generate a JWT token
          const token = jwt.sign(
              { id: user.id, role: user.role },
              JWT_SECRET, // JWT secret key
              { expiresIn: '12h' } // Token validity
          );

          // Respond with success and token
          res.status(200).json({
              message: 'Login successful',
              token, // Return the generated JWT token
              user: { id: user.id, username: user.username, role: user.role }, // Include user details
          });
      } catch (compareError) {
          return res.status(500).json({ error: compareError.message });
      }
  });
};

// Get User by ID
exports.getUserById = (req, res) => {
  const userId = req.params.id;

  const query = 'SELECT * FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err || results.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }
    res.status(200).json({ user: results[0] });
  });
};

// Update User
exports.updateUser = (req, res) => {
  const userId = req.params.id;
  const { name, email, role } = req.body;

  const query = 'UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?';
  db.query(query, [name, email, role, userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error updating user' });
    }
    res.status(200).json({ message: 'User updated successfully' });
  });
};

// Delete User
exports.deleteUser = (req, res) => {
  const userId = req.params.id;

  const query = 'DELETE FROM users WHERE id = ?';
  db.query(query, [userId], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error deleting user' });
    }
    res.status(200).json({ message: 'User deleted successfully' });
  });
};
exports.getAllUsers = (req, res) => {
  const query = 'SELECT * FROM users';
  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Error retrieving users' });
    }
    if (results.length === 0) {
      return res.status(404).json({ message: 'No users found' });
    }
    res.status(200).json({ users: results });
  });
};
