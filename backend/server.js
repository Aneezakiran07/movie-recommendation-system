const express = require('express');
const cors = require('cors');
const sql = require('mssql/msnodesqlv8');

const app = express();
const PORT = 4000;

app.use(cors());
app.use(express.json());

// ✅ SQL Server config using Windows Authentication
const config = {
  server: 'ANEEZAPC',
  database: 'dbp',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

// 🏠 Root route
app.get('/', (req, res) => {
  res.send('✅ Backend running with Windows Authentication!');
});

// 🎬 Movies API
app.get('/api/movies', async (req, res) => {
  try {
    const pool = await sql.connect(config);
    const result = await pool.request().query('SELECT TOP 10 * FROM Movies');
    res.json(result.recordset);
  } catch (err) {
    console.error('❌ SQL ERROR:', err);
    res.status(500).json({ error: 'Database query failed' });
  }
});

// 🚀 Start server
app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});
