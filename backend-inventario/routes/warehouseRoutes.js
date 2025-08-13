const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener todos los almacenes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM warehouses');
    res.json(rows);
  } catch (error) {
    console.error('❌ Error al obtener almacenes:', error);
    res.status(500).json({ error: 'Error al obtener almacenes' });
  }
});

module.exports = router;

