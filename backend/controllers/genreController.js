const { connectToDB, sql } = require('../db');

const getAllGenres = async (req, res) => {
  try {
    const pool = await connectToDB();
    const result = await pool.request().query('SELECT * FROM genres');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ Failed to fetch genres:', err);
    res.status(500).json({ error: 'Error fetching genres' });
  }
};

module.exports = { getAllGenres };
