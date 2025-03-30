const sql = require('mssql');

// Database Configuration
const config = {
  user: "DBProject",
  password: "Zamam12345",
  server: "localhost",
  database: "DB_Project",
  port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
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
