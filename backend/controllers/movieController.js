const { connectToDB, sql } = require('../db');
const axios = require('axios');

//  GET all movies
const getAllMovies = async (req, res) => {
  try {
    const pool = await connectToDB();
    const result = await pool.request().query('SELECT * FROM Movies');
    res.json(result.recordset);
  } catch (err) {
    console.error(' Error fetching all movies:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};

//  GET top 10 rated movies
const getTopRatedMovies = async (req, res) => {
  try {
    const pool = await connectToDB();
    const result = await pool.request().query(`
    SELECT M.Movie_id, M.title, M.duration_minutes, M.description, M.release_date, M.original_language, M.ratings, 
    STRING_AGG(G.genre_name, ', ') AS Genres
    FROM Movies M
    JOIN movie_genres MG ON M.Movie_id = MG.movie_id
    JOIN genres G ON G.genre_id = MG.genre_id
    GROUP BY M.Movie_id, M.title, M.duration_minutes, M.description, M.release_date, M.original_language, M.ratings
    ORDER BY M.ratings DESC

    `);
    res.json(result.recordset);
  } catch (err) {
    console.error(' Error fetching top-rated movies:', err);
    res.status(500).json({ error: 'Failed to retrieve top-rated movies' });
  }
};

//  GET movies by title search
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
      .query(`
      SELECT M.Movie_id, M.title, M.duration_minutes, M.description, M.release_date, M.original_language, M.ratings, 
      STRING_AGG(G.genre_name, ', ') AS Genres
      FROM Movies M
      JOIN movie_genres MG ON M.Movie_id = MG.movie_id
      JOIN genres G ON G.genre_id = MG.genre_id
      WHERE title LIKE @title
      GROUP BY M.Movie_id, M.title, M.duration_minutes, M.description, M.release_date, M.original_language, M.ratings
    `);
    
    res.json(result.recordset);
  } catch (err) {
    console.error(' Error searching movies by title:', err);
    res.status(500).json({ error: 'Failed to search movies' });
  }
};

//  GET movies by genre
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
    console.error(' Error fetching movies by genre:', err);
    res.status(500).json({ error: 'Failed to retrieve movies by genre' });
  }
};

//  GET single movie by ID
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
    console.error(' Error fetching movie by ID:', err);
    res.status(500).json({ error: 'Failed to retrieve movie' });
  }
};
//  GET recommended movies for a user
const getRecommendedMovies = async (req, res) => {
  const userId = req.params.userId;

  const query = `
   SELECT DISTINCT TOP 20 M.Movie_id, M.title, M.duration_minutes, M.description, M.release_date, M.original_language, M.ratings, 
   STRING_AGG(G.genre_name, ', ') AS Genres
  FROM Movies m
  JOIN movie_genres mg ON m.Movie_id = mg.movie_id
  JOIN genres G ON G.genre_id = MG.genre_id
  WHERE mg.genre_id IN (
    SELECT DISTINCT mg.genre_id
    FROM movie_genres mg
    JOIN Ratings r ON mg.movie_id = r.movie_id
    WHERE r.user_id = @userId AND r.rating >= 4
    UNION
    SELECT DISTINCT mg.genre_id
    FROM movie_genres mg
    JOIN Likes l ON mg.movie_id = l.movie_id
    WHERE l.user_id = @userId AND l.liked_status = 1
)
AND mg.genre_id NOT IN (
    SELECT DISTINCT mg.genre_id
    FROM movie_genres mg
    JOIN Ratings r ON mg.movie_id = r.movie_id
    WHERE r.user_id = @userId AND r.rating <= 2
)
AND m.Movie_id NOT IN (
    SELECT movie_id FROM Ratings WHERE user_id = @userId
    UNION
    SELECT movie_id FROM Likes WHERE user_id = @userId
    UNION
    SELECT movie_id FROM Watchlist WHERE user_id = @userId
)
GROUP BY M.Movie_id, M.title, M.duration_minutes, M.description, M.release_date, M.original_language, M.ratings
ORDER BY m.ratings DESC;

  `;

  try {
    const pool = await connectToDB();
    const result = await pool.request()
      .input('userId', sql.Int, userId)
      .query(query);

    res.json(result.recordset);
  } catch (err) {
    console.error(' Error generating recommendations:', err);
    res.status(500).json({ error: 'Failed to generate recommendations' });
  }
};

//filtered search 
const filterMovies = async (req, res) => {
  const {
    title,
    genre,
    minRating,
    maxRating,
    language,
    year
  } = req.query;

  let conditions = [];
  let inputs = [];

  if (title) {
    conditions.push('m.title LIKE @title');
    inputs.push({ name: 'title', type: sql.VarChar, value: `%${title}%` });
  }

  if (genre) {
    conditions.push('mg.genre_id = @genreId');
    inputs.push({ name: 'genreId', type: sql.Int, value: parseInt(genre) });
  }

  if (minRating) {
    conditions.push('m.ratings >= @minRating');
    inputs.push({ name: 'minRating', type: sql.Float, value: parseFloat(minRating) });
  }

  if (maxRating) {
    conditions.push('m.ratings <= @maxRating');
    inputs.push({ name: 'maxRating', type: sql.Float, value: parseFloat(maxRating) });
  }

  if (language) {
    conditions.push('m.original_language = @language');
    inputs.push({ name: 'language', type: sql.VarChar, value: language });
  }

  if (year) {
    conditions.push('YEAR(m.release_date) = @year');
    inputs.push({ name: 'year', type: sql.Int, value: parseInt(year) });
  }

  const whereClause = conditions.length > 0
    ? 'WHERE ' + conditions.join(' AND ')
    : '';

  const query = `
    SELECT DISTINCT m.*
    FROM Movies m
    LEFT JOIN movie_genres mg ON m.Movie_id = mg.movie_id
    ${whereClause}
    ORDER BY m.ratings DESC;
  `;

  try {
    const pool = await connectToDB();
    let request = pool.request();

    inputs.forEach(input => {
      request = request.input(input.name, input.type, input.value);
    });

    const result = await request.query(query);
    res.json(result.recordset);
  } catch (err) {
    console.error(' Error filtering movies:', err);
    res.status(500).json({ error: 'Failed to filter movies' });
  }
};

module.exports = {
  getAllMovies,
  getTopRatedMovies,
  searchMoviesByTitle,
  getMoviesByGenre,
  getMovieById,
  getRecommendedMovies,
  filterMovies
};


