const express = require('express');
const router = express.Router();
const db = require('../database');

// Ruta de prueba para verificar que el archivo está funcionando
router.get('/test', (req, res) => {
  res.send('Ruta de test de warehouses funcionando correctamente');
});

// Obtener todos los almacenes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM warehouses');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener almacenes:', error);
    res.status(500).json({ error: 'Error al obtener almacenes desde la base de datos' });
  }
});

module.exports = router;
