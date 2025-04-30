const express = require('express');
const router = express.Router();
const {
  addRating,
  getRatingsByUser,
  getRatingsByMovie,
  updateRating
} = require('../controllers/ratingController');

// Add new rating
router.post('/', addRating);

// Get all ratings by user
router.get('/user/:userId', getRatingsByUser);

//Update Rating of User
router.post('/update-rating', updateRating);

// Get all ratings for a movie
router.get('/movie/:movieId', getRatingsByMovie);

module.exports = router;
