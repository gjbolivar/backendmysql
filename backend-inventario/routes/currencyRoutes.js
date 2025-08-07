const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener todas las monedas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM currencies');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener monedas:', error);
    res.status(500).json({ error: 'Error al obtener monedas' });
  }
});

module.exports = router;
