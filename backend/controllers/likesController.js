const { connectToDB, sql } = require('../db');

//  Like a movie
const likeMovie = async (req, res) => {
  const { user_id, movie_id } = req.body;

  if (!user_id || !movie_id) {
    return res.status(400).json({ error: 'user_id and movie_id are required' });
  }

  try {
    const pool = await connectToDB();
    await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('movie_id', sql.Int, movie_id)
      .input('liked_status', sql.Int, 1)
      .query(`
        INSERT INTO Likes (user_id, movie_id, liked_status)
        VALUES (@user_id, @movie_id, @liked_status)
      `);

    res.status(201).json({ message: 'Movie liked successfully' });
  } catch (err) {
    console.error(' Error liking movie:', err);
    res.status(500).json({ error: 'Failed to like movie' });
  }
};

//  Get liked movies of a user
const getLikedMovies = async (req, res) => {
  const userId = req.params.userId;

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
        SELECT  M.Movie_id, M.title, M.duration_minutes, M.description, M.release_date, M.original_language, M.ratings, 
        STRING_AGG(G.genre_name, ', ') AS Genres
        FROM Likes l
        JOIN Movies m ON l.movie_id = m.Movie_id
        JOIN movie_genres mg ON m.Movie_id = mg.movie_id
        JOIN genres G ON G.genre_id = MG.genre_id
        WHERE l.user_id = @userId AND l.liked_status = 1
        GROUP BY M.Movie_id, M.title, M.duration_minutes, M.description, M.release_date, M.original_language, M.ratings
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error(' Error fetching liked movies:', err);
    res.status(500).json({ error: 'Failed to fetch liked movies' });
  }
};

//  Unlike a movie (remove like)
const unlikeMovie = async (req, res) => {
  const { user_id, movie_id } = req.body;

  try {
    const pool = await connectToDB();
    await pool.request()
      .input('user_id', sql.Int, user_id)
      .input('movie_id', sql.Int, movie_id)
      .query(`
        DELETE FROM Likes WHERE user_id = @user_id AND movie_id = @movie_id
      `);

    res.json({ message: 'Movie unliked successfully' });
  } catch (err) {
    console.error(' Error unliking movie:', err);
    res.status(500).json({ error: 'Failed to unlike movie' });
  }
};

module.exports = {
  likeMovie,
  getLikedMovies,
  unlikeMovie
};
