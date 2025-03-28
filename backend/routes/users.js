const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers
} = require('../controllers/userController');

// Create new user
router.post('/', createUser);

// Get all users
router.get('/', getAllUsers);

module.exports = router;
