// database.js
const mysql = require('mysql2');

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'nuevaclave123', 
  database: 'inventario_app' 
});

connection.connect((err) => {
  if (err) {
    console.error('❌ Error al conectar a MySQL:', err);
  } else {
    console.log('✅ Conexión exitosa a la base de datos MySQL');
  }
});

module.exports = connection;
