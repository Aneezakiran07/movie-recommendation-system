const sql = require('mssql/msnodesqlv8');

const config = {
  server: 'ANEEZAPC',
  database: 'dbp',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

async function connectToDB() {
  try {
    const pool = await sql.connect(config);
    return pool;
  } catch (err) {
    console.error('❌ SQL CONNECTION ERROR:', err);
    throw err;
  }
}

module.exports = { sql, connectToDB };
