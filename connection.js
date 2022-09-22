const mysql = require('mysql2');

// Connect to database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Sqlpswd1!',
    database: 'company_db'
  },
  console.log(`Connected to the company_db database.`)
  );

module.exports = connection;