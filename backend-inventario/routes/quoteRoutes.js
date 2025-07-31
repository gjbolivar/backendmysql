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

// Obtener una cotización con sus productos (items desde tabla quotes_items)
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [quoteRows] = await db.query('SELECT * FROM quotes WHERE id = ?', [id]);
    if (quoteRows.length === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    const quote = quoteRows[0];

    // Obtener los productos de la cotización desde quotes_items
    const [items] = await db.query('SELECT * FROM quotes_items WHERE quote_id = ?', [id]);
    quote.items = items;

    res.json(quote);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear nueva cotización
router.post('/', async (req, res) => {
  const { client, rif, phone, address, date, items, paymentMethod, currency, sellerId } = req.body;

  try {
    // Insertar cotización
    const [result] = await db.query(
      'INSERT INTO quotes (client, rif, phone, address, date, paymentMethod, currency, sellerId, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [client, rif, phone, address, date, paymentMethod, currency, sellerId, 'pendiente']
    );

    const quoteId = result.insertId;

    // Insertar cada item en quotes_items
    for (const item of items) {
      await db.query(
        'INSERT INTO quotes_items (quote_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [quoteId, item.id, item.quantity, item.price]
      );
    }

    res.json({ id: quoteId, message: 'Cotización creada correctamente' });
  } catch (err) {
    console.error('Error al crear cotización:', err.message);
    res.status(500).json({ error: err.message });
  }
});

// Actualizar cotización (sin tocar items)
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { client, rif, phone, address, date, paymentMethod, currency, sellerId } = req.body;

  try {
    await db.query(
      'UPDATE quotes SET client = ?, rif = ?, phone = ?, address = ?, date = ?, paymentMethod = ?, currency = ?, sellerId = ? WHERE id = ?',
      [client, rif, phone, address, date, paymentMethod, currency, sellerId, id]
    );

    res.json({ message: 'Cotización actualizada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Aprobar cotización
router.post('/:id/approve', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE quotes SET status = ? WHERE id = ?', ['aprobada', id]);
    res.json({ message: 'Cotización aprobada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Devolver cotización
router.post('/:id/return', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('UPDATE quotes SET status = ? WHERE id = ?', ['devuelta', id]);
    res.json({ message: 'Cotización devuelta' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar cotización y sus items
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM quotes_items WHERE quote_id = ?', [id]);
    await db.query('DELETE FROM quotes WHERE id = ?', [id]);
    res.json({ message: 'Cotización eliminada' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

