const express = require('express');
const router = express.Router();
const db = require('../db');

// Obtener todas las cotizaciones
router.get('/', async (req, res) => {
  try {
    const [quotes] = await db.query('SELECT * FROM quotes');
    res.json(quotes);
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    res.status(500).json({ error: 'Error al obtener cotizaciones' });
  }
});

// Obtener una cotización por ID
router.get('/:id', async (req, res) => {
  const quoteId = req.params.id;
  try {
    const [[quote]] = await db.query('SELECT * FROM quotes WHERE id = ?', [quoteId]);
    if (!quote) return res.status(404).json({ error: 'Cotización no encontrada' });

    const [items] = await db.query('SELECT * FROM quotes_items WHERE quote_id = ?', [quoteId]);
    quote.items = items;
    res.json(quote);
  } catch (error) {
    console.error('Error al obtener cotización por ID:', error);
    res.status(500).json({ error: 'Error al obtener cotización' });
  }
});

// Crear nueva cotización
router.post('/', async (req, res) => {
  const { client, rif, phone, address, date, paymentMethod, sellerId, currency, status, items } = req.body;

  if (!client || !date || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Datos inválidos para crear cotización' });
  }

  try {
    const [result] = await db.query(
      'INSERT INTO quotes (client, rif, phone, address, date, paymentMethod, sellerId, currency, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [client, rif, phone, address, date, paymentMethod, sellerId, currency, status || 'pendiente']
    );
    const quoteId = result.insertId;

    for (const item of items) {
      await db.query(
        'INSERT INTO quotes_items (quote_id, name, quantity, price, isService, warehouseId, productId) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          quoteId,
          item.name,
          item.quantity,
          item.price,
          item.isService || false,
          item.warehouseId || null,
          item.productId || null
        ]
      );
    }

    res.status(201).json({ id: quoteId });
  } catch (error) {
    console.error('Error al crear cotización:', error);
    res.status(500).json({ error: 'Error al crear cotización' });
  }
});

// Actualizar cotización existente
router.put('/:id', async (req, res) => {
  const quoteId = req.params.id;
  const { client, rif, phone, address, date, paymentMethod, sellerId, currency, status, items } = req.body;

  if (!client || !date || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Datos inválidos para actualizar cotización' });
  }

  try {
    await db.query(
      'UPDATE quotes SET client = ?, rif = ?, phone = ?, address = ?, date = ?, paymentMethod = ?, sellerId = ?, currency = ?, status = ? WHERE id = ?',
      [client, rif, phone, address, date, paymentMethod, sellerId, currency, status || 'pendiente', quoteId]
    );

    await db.query('DELETE FROM quotes_items WHERE quote_id = ?', [quoteId]);

    for (const item of items) {
      await db.query(
        'INSERT INTO quotes_items (quote_id, name, quantity, price, isService, warehouseId, productId) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [
          quoteId,
          item.name,
          item.quantity,
          item.price,
          item.isService || false,
          item.warehouseId || null,
          item.productId || null
        ]
      );
    }

    res.json({ message: 'Cotización actualizada correctamente' });
  } catch (error) {
    console.error('Error al actualizar cotización:', error);
    res.status(500).json({ error: 'Error al actualizar cotización' });
  }
});

// Aprobar cotización
router.put('/:id/approve', async (req, res) => {
  const quoteId = req.params.id;
  try {
    await db.query('UPDATE quotes SET status = ? WHERE id = ?', ['aprobada', quoteId]);
    res.json({ message: 'Cotización aprobada' });
  } catch (error) {
    console.error('Error al aprobar cotización:', error);
    res.status(500).json({ error: 'Error al aprobar cotización' });
  }
});

// Devolver cotización
router.put('/:id/return', async (req, res) => {
  const quoteId = req.params.id;
  try {
    await db.query('UPDATE quotes SET status = ? WHERE id = ?', ['devuelta', quoteId]);
    res.json({ message: 'Cotización devuelta' });
  } catch (error) {
    console.error('Error al devolver cotización:', error);
    res.status(500).json({ error: 'Error al devolver cotización' });
  }
});

// Eliminar cotización
router.delete('/:id', async (req, res) => {
  const quoteId = req.params.id;
  try {
    await db.query('DELETE FROM quotes_items WHERE quote_id = ?', [quoteId]);
    await db.query('DELETE FROM quotes WHERE id = ?', [quoteId]);
    res.json({ message: 'Cotización eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar cotización:', error);
    res.status(500).json({ error: 'Error al eliminar cotización' });
  }
});

module.exports = router;
