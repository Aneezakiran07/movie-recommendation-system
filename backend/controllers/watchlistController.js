const { connectToDB, sql } = require('../db');

// 🔹 Add movie to watchlist
const addToWatchlist = async (req, res) => {
  const { user_id, movie_id } = req.body;

  if (!user_id || !movie_id) {
    return res.status(400).json({ error: 'user_id and movie_id are required' });
  }

  try {
    const pool = await connectToDB();
    await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('movie_id', sql.Int, movie_id)
      .query(`
        INSERT INTO WatchList (user_id, movie_id)
        VALUES (@user_id, @movie_id)
      `);

    res.status(201).json({ message: 'Movie added to watchlist' });
  } catch (err) {
    console.error(' Error adding to watchlist:', err);
    res.status(500).json({ error: 'Failed to add movie to watchlist' });
  }
};

// 🔹 Get user’s watchlist
const getWatchlist = async (req, res) => {
  const userId = req.params.userId;

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT m.*
        FROM WatchList w
        JOIN Movies m ON w.movie_id = m.Movie_id
        WHERE w.user_id = @userId
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error(' Error fetching watchlist:', err);
    res.status(500).json({ error: 'Failed to fetch watchlist' });
  }
};

// 🔹 Remove movie from watchlist
const removeFromWatchlist = async (req, res) => {
  const { user_id, movie_id } = req.body;

  try {
    const pool = await connectToDB();
    await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('movie_id', sql.Int, movie_id)
      .query(`
        DELETE FROM WatchList WHERE user_id = @user_id AND movie_id = @movie_id
      `);

    res.json({ message: 'Movie removed from watchlist' });
  } catch (err) {
    console.error(' Error removing from watchlist:', err);
    res.status(500).json({ error: 'Failed to remove movie' });
  }
};

module.exports = {
  addToWatchlist,
  getWatchlist,
  removeFromWatchlist
};
