const sql = require('mssql/msnodesqlv8');

const config = {
  server: 'ANEEZAPC',
  database: 'dbp',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true
  }
};

module.exports = { sql, config };
