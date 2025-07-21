const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener todas las cotizaciones
router.get('/', async (req, res) => {
  try {
    const [quotes] = await db.query('SELECT * FROM quotes ORDER BY id DESC');
    for (const quote of quotes) {
      const [items] = await db.query('SELECT * FROM quotes_items WHERE quoteId = ?', [quote.id]);
      quote.items = items.map(item => ({
        ...item,
        quantity: parseInt(item.quantity),
        price: parseFloat(item.price),
        isService: item.isService === 1
      }));
    }
    res.json(quotes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener una cotización por ID
router.get('/:id', async (req, res) => {
  try {
    const [quotes] = await db.query('SELECT * FROM quotes WHERE id = ?', [req.params.id]);
    if (quotes.length === 0) return res.status(404).json({ error: 'Cotización no encontrada' });

    const quote = quotes[0];
    const [items] = await db.query('SELECT * FROM quotes_items WHERE quoteId = ?', [quote.id]);
    quote.items = items.map(item => ({
      ...item,
      quantity: parseInt(item.quantity),
      price: parseFloat(item.price),
      isService: item.isService === 1
    }));

    res.json(quote);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear nueva cotización
router.post('/', async (req, res) => {
  const {
    id, client, rif, phone, address, date,
    items, paymentMethod, currency, sellerId, status = 'pendiente'
  } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `INSERT INTO quotes 
      (id, client, rif, phone, address, date, paymentMethod, currency, sellerId, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, client, rif, phone, address, date, paymentMethod, currency, sellerId, status]
    );

    for (const item of items) {
      await conn.query(
        `INSERT INTO quotes_items 
        (quoteId, id, name, partNumber, quantity, price, warehouseId, isService) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          id, item.id, item.name, item.partNumber,
          item.quantity, item.price, item.warehouseId,
          item.isService ? 1 : 0
        ]
      );
    }

    await conn.commit();
    res.status(201).json({ message: 'Cotización guardada correctamente' });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
});

// Editar cotización existente
router.put('/:id', async (req, res) => {
  const {
    client, rif, phone, address, date,
    items, paymentMethod, currency, sellerId, status
  } = req.body;

  const conn = await db.getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE quotes SET 
        client = ?, rif = ?, phone = ?, address = ?, 
        date = ?, paymentMethod = ?, currency = ?, sellerId = ?, status = ?
      WHERE id = ?`,
      [client, rif, phone, address, date, paymentMethod, currency, sellerId, status, req.params.id]
    );

    await conn.query(`DELETE FROM quotes_items WHERE quoteId = ?`, [req.params.id]);

    for (const item of items) {
      await conn.query(
        `INSERT INTO quotes_items 
        (quoteId, id, name, partNumber, quantity, price, warehouseId, isService) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          req.params.id, item.id, item.name, item.partNumber,
          item.quantity, item.price, item.warehouseId,
          item.isService ? 1 : 0
        ]
      );
    }

    await conn.commit();
    res.json({ message: 'Cotización actualizada correctamente' });
  } catch (error) {
    await conn.rollback();
    res.status(500).json({ error: error.message });
  } finally {
    conn.release();
  }
});

// Cambiar estado a "aprobada" o "devuelta"
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  try {
    await db.query('UPDATE quotes SET status = ? WHERE id = ?', [status, req.params.id]);
    res.json({ message: `Estado actualizado a "${status}"` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
