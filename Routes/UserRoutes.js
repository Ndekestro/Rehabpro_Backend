// routes/userRoutes.js

const express = require('express');
const router = express.Router();

// Import user controller
const userController = require('../Controllers/UserController');

// User Registration
router.post('/register', userController.registerUser);

// User Login
router.post('/login', userController.loginUser);
router.get('/', userController.getAllUsers);

// Get User by ID
router.get('/:id', userController.getUserById);

// Update User
router.put('/:id', userController.updateUser);

// Delete User
router.delete('/:id', userController.deleteUser);

module.exports = router;
