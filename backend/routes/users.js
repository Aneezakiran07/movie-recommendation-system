const express = require('express');
const router = express.Router();
const {
  createUser,
  getAllUsers,
  deleteUser
} = require('../controllers/userController');

// Create new user
router.post('/', createUser);

// Get all users
router.get('/', getAllUsers);
//  Delete user
router.delete('/:userId', deleteUser);

module.exports = router;
