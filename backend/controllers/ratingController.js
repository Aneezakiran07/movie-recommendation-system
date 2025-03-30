const { connectToDB, sql } = require('../db');

// 🔹 Add a new rating
const addRating = async (req, res) => {
  const { user_id, movie_id, rating } = req.body;

  if (!user_id || !movie_id || !rating) {
    return res.status(400).json({ error: 'user_id, movie_id, and rating are required' });
  }

  try {
    const pool = await connectToDB();
    await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('movie_id', sql.Int, movie_id)
      .input('rating', sql.Decimal(4, 2), rating)
      .query(`
        INSERT INTO Ratings (user_id, movie_id, rating)
        VALUES (@user_id, @movie_id, @rating)
      `);

    res.status(201).json({ message: 'Rating added successfully' });
  } catch (err) {
    console.error('❌ Error adding rating:', err);
    res.status(500).json({ error: 'Failed to add rating' });
  }
};

// 🔹 Get ratings by user ID
const getRatingsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query('SELECT * FROM Ratings WHERE user_id = @userId');

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching user ratings:', err);
    res.status(500).json({ error: 'Failed to fetch user ratings' });
  }
};

// 🔹 Get ratings by movie ID
const getRatingsByMovie = async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('movieId', sql.Int, movieId)
      .query('SELECT * FROM Ratings WHERE movie_id = @movieId');

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching movie ratings:', err);
    res.status(500).json({ error: 'Failed to fetch movie ratings' });
  }
};

// 🔹 Get average rating for a movie
const getAverageRating = async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('movieId', sql.Int, movieId)
      .query('SELECT AVG(rating) AS averageRating FROM Ratings WHERE movie_id = @movieId');

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error calculating average rating:', err);
    res.status(500).json({ error: 'Failed to fetch average rating' });
  }
};

module.exports = {
  addRating,
  getRatingsByUser,
  getRatingsByMovie,
  getAverageRating
};

