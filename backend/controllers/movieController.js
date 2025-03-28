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

module.exports = { getAllMovies };
