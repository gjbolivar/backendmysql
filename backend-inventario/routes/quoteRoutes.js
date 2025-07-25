const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener todas las cotizaciones
router.get('/', async (req, res) => {
  try {
    const [quotes] = await db.query('SELECT * FROM quotes ORDER BY id DESC');
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
});

// Obtener solo cotizaciones aprobadas
router.get('/status/aprobada', async (req, res) => {
  try {
    const [quotes] = await db.query('SELECT * FROM quotes WHERE status = ?', ['aprobada']);
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener cotizaciones aprobadas' });
  }
});

// Obtener cotización por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [quote] = await db.query('SELECT * FROM quotes WHERE id = ?', [id]);
    if (quote.length === 0) return res.status(404).json({ error: 'Cotización no encontrada' });
    res.json(quote[0]);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la cotización' });
  }
});

// Crear nueva cotización
router.post('/', async (req, res) => {
  const { client, date, status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO quotes (client, date, status) VALUES (?, ?, ?)',
      [client, date, status || 'pendiente']
    );
    res.status(201).json({ id: result.insertId });
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la cotización' });
  }
});

// Aprobar cotización
router.put('/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE quotes SET status = ? WHERE id = ?', ['aprobada', id]);
    res.json({ message: 'Cotización aprobada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
