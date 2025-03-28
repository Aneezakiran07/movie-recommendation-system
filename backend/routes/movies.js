const express = require('express');
const router = express.Router();

const {
  getAllMovies,
  getTopRatedMovies,
  searchMoviesByTitle,
  getMoviesByGenre,
  getMovieById
} = require('../controllers/movieController');

// 🔹 Get all movies
router.get('/', getAllMovies);

// 🔹 Top-rated movies
router.get('/top-rated', getTopRatedMovies);

// 🔹 Search by title (query param: ?title=...)
router.get('/search', searchMoviesByTitle);

// 🔹 Movies by genre
router.get('/genre/:genreId', getMoviesByGenre);

// 🔹 Movie by ID
router.get('/:id', getMovieById);

module.exports = router;
