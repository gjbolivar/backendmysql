const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener todas las cotizaciones
router.get('/', async (req, res) => {
  try {
    const [quotes] = await db.query('SELECT * FROM quotes');
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
    const [items] = await db.query('SELECT * FROM quotes_items WHERE quoteId = ?', [id]);
    res.json({ ...quote[0], items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear nueva cotización
router.post('/', async (req, res) => {
  const { customerName, customerPhone, items, total, status } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO quotes (customerName, customerPhone, total, status, createdAt) VALUES (?, ?, ?, ?, NOW())',
      [customerName, customerPhone, total, status]
    );
    const quoteId = result.insertId;

    for (const item of items) {
      await db.query(
        'INSERT INTO quotes_items (quoteId, partNumber, description, quantity, unitPrice, subtotal) VALUES (?, ?, ?, ?, ?, ?)',
        [quoteId, item.partNumber, item.description, item.quantity, item.unitPrice, item.subtotal]
      );
    }

    res.json({ id: quoteId });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aprobar cotización
router.put('/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE quotes SET status = "aprobada" WHERE id = ?', [id]);
    res.json({ message: 'Cotización aprobada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Devolver cotización
router.put('/:id/return', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE quotes SET status = "devuelta" WHERE id = ?', [id]);
    res.json({ message: 'Cotización devuelta' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
