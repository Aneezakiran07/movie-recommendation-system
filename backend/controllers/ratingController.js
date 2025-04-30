const { connectToDB, sql } = require('../db');

//  Add a new rating
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
    console.error(' Error adding rating:', err);
    res.status(500).json({ error: 'Failed to add rating' });
  }
};

//  Update a rating
const updateRating = async (req, res) => {
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
          UPDATE Ratings SET rating = @rating 
          WHERE user_id = @user_id AND movie_id = @movie_id
      `);

    res.status(201).json({ message: 'Rating updated successfully' });
  } catch (err) {
    console.error(' Error updating rating:', err);
    res.status(500).json({ error: 'Failed to update rating' });
  }
};

//  Get ratings by user ID
const getRatingsByUser = async (req, res) => {
  const userId = req.params.userId;

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(`
      SELECT  M.Movie_id, M.title, M.duration_minutes, M.description, M.release_date, M.original_language, M.ratings, 
      STRING_AGG(G.genre_name, ', ') AS Genres, r.rating as user_rating
      FROM Ratings r
      JOIN Movies m ON r.movie_id = m.Movie_id
      JOIN movie_genres mg ON m.Movie_id = mg.movie_id
      JOIN genres G ON G.genre_id = MG.genre_id
      WHERE r.user_id = @userId
      GROUP BY M.Movie_id, M.title, M.duration_minutes, M.description, M.release_date, M.original_language, M.ratings, r.rating
    
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('Error fetching user ratings:', err);
    res.status(500).json({ error: 'Failed to fetch user ratings' });
  }
};


//  Get ratings by movie ID
const getRatingsByMovie = async (req, res) => {
  const movieId = req.params.movieId;

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('movieId', sql.Int, movieId)
      .query('SELECT * FROM Ratings WHERE movie_id = @movieId');

    res.json(result.recordset);
  } catch (err) {
    console.error(' Error fetching movie ratings:', err);
    res.status(500).json({ error: 'Failed to fetch movie ratings' });
  }
};



module.exports = {
  addRating,
  getRatingsByUser,
  getRatingsByMovie,
  updateRating
};

