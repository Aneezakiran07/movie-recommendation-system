const express = require('express');
const router = express.Router();

const Signup = require('../controllers/signUpController');
const Login = require('../controllers/loginController');
const GetUserInfo = require('../controllers/getUserInfoController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /signup
// @desc    Register a new user
router.post('/signup', Signup);

// @route   POST /login
// @desc    Login existing user
router.post('/login', Login);

// @route   GET /user-info
// @desc    Get logged-in user's info (protected)
router.get('/user-info', authMiddleware, GetUserInfo);

// @route   POST /logout
// @desc    Handle logout (client just deletes token)
router.post('/logout', (req, res) => {
  // This just tells frontend to remove token
  return res.json({ msg: 'User logged out successfully (token deleted on client)' });
});

module.exports = router;