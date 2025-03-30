const express = require('express');
const router = express.Router();
const {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist
} = require('../controllers/watchlistController');

// Add to watchlist
router.post('/', addToWatchlist);

// Get user's watchlist
router.get('/:userId', getWatchlist);

// Remove from watchlist
router.delete('/', removeFromWatchlist);

module.exports = router;
