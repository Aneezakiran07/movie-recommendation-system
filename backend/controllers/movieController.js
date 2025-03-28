const { connectToDB } = require('../db');
const sql = require('mssql'); // required for .input()

// 🔹 GET all movies
const getAllMovies = async (req, res) => {
  try {
    const pool = await connectToDB();
    const result = await pool.request().query('SELECT * FROM Movies');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching all movies:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

// 🔹 GET top 10 rated movies
const getTopRatedMovies = async (req, res) => {
  try {
    const pool = await connectToDB();
    const result = await pool.request().query(`
      SELECT TOP 10 * FROM Movies ORDER BY vote_average DESC
    `);
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching top-rated movies:', err);
    res.status(500).json({ error: 'Failed to retrieve top-rated movies' });
  }
};

// 🔹 GET movies by title search
const searchMoviesByTitle = async (req, res) => {
  const title = req.query.title;

  if (!title) {
    return res.status(400).json({ error: 'Title is required in query' });
  }

  try {
    const pool = await connectToDB();
    const result = await pool
      .request()
      .input('title', sql.VarChar, `%${title}%`)
      .query('SELECT * FROM Movies WHERE title LIKE @title');
    
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error searching movies by title:', err);
    res.status(500).json({ error: 'Failed to search movies' });
  }
};

// 🔹 GET movies by genre
const getMoviesByGenre = async (req, res) => {
  const genreId = req.params.genreId;

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('genreId', sql.Int, genreId)
      .query(`
        SELECT m.*
        FROM Movies m
        JOIN movie_genres mg ON m.Movie_id = mg.movie_id
        WHERE mg.genre_id = @genreId
      `);

    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Error fetching movies by genre:', err);
    res.status(500).json({ error: 'Failed to retrieve movies by genre' });
  }
};

// 🔹 GET single movie by ID
const getMovieById = async (req, res) => {
  const movieId = req.params.id;

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('movieId', sql.Int, movieId)
      .query('SELECT * FROM Movies WHERE Movie_id = @movieId');

    if (result.recordset.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    res.json(result.recordset[0]);
  } catch (err) {
    console.error('❌ Error fetching movie by ID:', err);
    res.status(500).json({ error: 'Failed to retrieve movie' });
  }
};

module.exports = {
  getAllMovies,
  getTopRatedMovies,
  searchMoviesByTitle,
  getMoviesByGenre,
  getMovieById
};


