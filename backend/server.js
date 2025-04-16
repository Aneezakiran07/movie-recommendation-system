require('dotenv').config();

const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 4000;

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const movieRoutes = require('./routes/movies');
const genreRoutes = require('./routes/genres');
const userRoutes = require('./routes/users');
const ratingRoutes = require('./routes/rating');
const watchlistRoutes = require('./routes/watchlist');
const likeRoutes = require('./routes/likes');
const authRoutes = require('./routes/auth');

// Root route
app.get('/', (req, res) => {
  res.send(' Backend running with Windows Authentication!');
});

// Mount routes
app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);
app.use('/api/users', userRoutes); 
app.use('/api/ratings', ratingRoutes);
app.use('/api/watchlist', watchlistRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/auth', authRoutes);


// Start server
app.listen(PORT, () => {
  console.log(` Server running at http://localhost:${PORT}`);
});
