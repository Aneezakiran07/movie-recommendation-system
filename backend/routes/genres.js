const express = require('express');
const router = express.Router();
const { getAllGenres } = require('../controllers/genreController');

// GET /api/genres
router.get('/', getAllGenres);

module.exports = router;
