const express = require('express');
const router = express.Router();
const db = require('../config/db');

// Obtener todas las cotizaciones
router.get('/', async (req, res) => {
  try {
    const [quotes] = await db.query('SELECT * FROM quotes');
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener cotizaciones por estado
router.get('/status/:status', async (req, res) => {
  const { status } = req.params;
  try {
    const [quotes] = await db.query('SELECT * FROM quotes WHERE status = ?', [status]);
    res.json(quotes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener una cotización por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [quote] = await db.query('SELECT * FROM quotes WHERE id = ?', [id]);
    res.json(quote[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear una nueva cotización
router.post('/', async (req, res) => {
  const { client, rif, phone, address, date, items, paymentMethod, currency, sellerId } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO quotes (client, rif, phone, address, date, items, paymentMethod, currency, sellerId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [client, rif, phone, address, date, JSON.stringify(items), paymentMethod, currency, sellerId, 'pendiente']
    );
    res.json({ id: result.insertId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Actualizar cotización existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { client, rif, phone, address, date, items, paymentMethod, currency, sellerId } = req.body;
  try {
    await db.query(
      'UPDATE quotes SET client = ?, rif = ?, phone = ?, address = ?, date = ?, items = ?, paymentMethod = ?, currency = ?, sellerId = ? WHERE id = ?',
      [client, rif, phone, address, date, JSON.stringify(items), paymentMethod, currency, sellerId, id]
    );
    res.json({ message: 'Cotización actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aprobar cotización (acepta PUT o POST)
router.put('/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE quotes SET status = ? WHERE id = ?', ['aprobada', id]);
    res.json({ message: 'Cotización aprobada (PUT)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post('/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE quotes SET status = ? WHERE id = ?', ['aprobada', id]);
    res.json({ message: 'Cotización aprobada (POST)' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Devolver cotización
router.post('/:id/return', async (req, res) => {
  const { id } = req.params;
  const { items } = req.body;
  try {
    // Aquí puedes añadir lógica para actualizar inventario si lo deseas
    await db.query('UPDATE quotes SET status = ? WHERE id = ?', ['devuelta', id]);
    res.json({ message: 'Cotización devuelta y stock actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar cotización
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM quotes WHERE id = ?', [id]);
    res.json({ message: 'Cotización eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
