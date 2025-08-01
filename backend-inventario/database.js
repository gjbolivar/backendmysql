const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.getConnection()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida con éxito.');
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MySQL:', err);
  });

module.exports = connection;
