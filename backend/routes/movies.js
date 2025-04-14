const express = require('express');
const router = express.Router();

const {
  getAllMovies,
  getTopRatedMovies,
  searchMoviesByTitle,
  getMoviesByGenre,
  getMovieById,
  getRecommendedMovies,
  filterMovies
} = require('../controllers/movieController');

//  Get all movies
router.get('/', getAllMovies);

// Top-rated movies
router.get('/top-rated', getTopRatedMovies);

//  Search by title (query param: ?title=...)
router.get('/search', searchMoviesByTitle);

//  Movies by genre
router.get('/genre/:genreId', getMoviesByGenre);

//  Movie by ID
router.get('/:id', getMovieById);

// Movie recommendation
router.get('/recommend/:userId', getRecommendedMovies);

//filtered search
router.get('/filter', filterMovies);


module.exports = router;
