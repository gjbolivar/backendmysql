const mysql = require('mysql2/promise');
require('dotenv').config();

const connection = mysql.createPool(process.env.DATABASE_URL);

connection.getConnection()
  .then(() => {
    console.log('✅ Conexión a MySQL establecida con éxito.');
  })
  .catch((err) => {
    console.error('❌ Error al conectar a MySQL:', err);
  });

module.exports = connection;


