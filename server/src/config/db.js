const mysql = require('mysql2');
const path = require('path');

const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  port: 3306,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

pool.getConnection((err, connection) => {
  if (err) {
    console.error('MySQL connection failed:', err.message)
  } else {
    console.log('MySQL connected')
    connection.release()
  }
})

module.exports = pool.promise();
