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

// User Login
// controllers/userController.js

exports.loginUser = (req, res) => {
  const { username, password } = req.body;

  console.log('Received login request:', { username, password });

  // Ensure the username and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  // Query to check if the user exists by username
  const query = 'SELECT * FROM users WHERE username = ?';

  db.query(query, [username], (err, results) => {
    if (err) {
      console.error('Error during login query:', err);
      return res.status(500).json({ error: 'Error during login' });
    }

    if (results.length === 0) {
      return res.status(400).json({ error: 'User not found' });
    }

    const user = results[0];

    // Compare the provided password with the stored password hash
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        console.error('Error comparing passwords:', err);
        return res.status(500).json({ error: 'Error comparing passwords' });
      }

      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid password' });
      }

      // Generate a JWT token with user id and role
      const token = jwt.sign(
        { id: user.id, role: user.role },
        JWT_SECRET, // Use the hardcoded JWT secret
        { expiresIn: '12h' } // Token expires in 12 hours
      );

      // Send the token, user role, and user id in the response
      res.status(200).json({
        message: 'Login successful',
        token,          // JWT token
        role: user.role, // User role (e.g., admin, participant)
        userId: user.id  // User ID
      });
    });
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
