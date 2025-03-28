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

// Root route
app.get('/', (req, res) => {
  res.send('✅ Backend running with Windows Authentication!');
});

// Mount movie routes

app.use('/api/movies', movieRoutes);
app.use('/api/genres', genreRoutes);

// Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
