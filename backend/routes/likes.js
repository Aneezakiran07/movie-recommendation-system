const express = require('express');
const router = express.Router();
const {
  likeMovie,
  getLikedMovies,
  unlikeMovie
} = require('../controllers/likeController');

// Like a movie
router.post('/', likeMovie);

// Get liked movies for a user
router.get('/:userId', getLikedMovies);

// Unlike a movie
router.delete('/', unlikeMovie);

module.exports = router;
