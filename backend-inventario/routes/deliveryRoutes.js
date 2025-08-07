const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener todas las entregas
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.promise().query('SELECT * FROM deliveries');
    res.json(rows);
  } catch (error) {
    console.error('Error al obtener entregas:', error);
    res.status(500).json({ error: 'Error al obtener entregas' });
  }
});

module.exports = router;
