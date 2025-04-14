const sql = require('mssql');

// Database Configuration
const config = {
  server: 'ANEEZAPC',
  database: 'dbp',
  driver: 'msnodesqlv8',
  options: {
    encrypt: false,
    trustServerCertificate: true,
    enableArithAbort: true
  }
};

const connectToDB = async () => {
  try {
    return await sql.connect(config);
  } catch (err) {
    console.error(' SQL CONNECTION ERROR:', err);
    throw err;
  }
};

module.exports = { connectToDB, sql };
