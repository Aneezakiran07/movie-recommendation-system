const { connectToDB } = require('../db');

const getAllMovies = async (req, res) => {
  try {
    const pool = await connectToDB();
    const result = await pool.request().query('SELECT TOP 10 * FROM Movies');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ SQL ERROR:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
};
const { connectToDB } = require('../db');

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


module.exports = { getAllMovies };
module.exports = {
  getAllMovies,
  getTopRatedMovies,
  searchMoviesByTitle
};

