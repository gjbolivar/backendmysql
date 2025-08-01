const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener todas las cotizaciones
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM quotes ORDER BY id DESC');

    const quotes = rows.map(row => {
      let itemsParsed = [];
      try {
        if (typeof row.items === 'string' && row.items.trim() !== '') {
          itemsParsed = JSON.parse(row.items);
        }
      } catch (e) {
        console.warn(`❌ Error al parsear items de quote ID ${row.id}:`, e.message);
      }

      return {
        ...row,
        items: itemsParsed
      };
    });

    res.json(quotes);
  } catch (err) {
    console.error('❌ Error al obtener cotizaciones:', err.message);
    res.status(500).json({ error: 'Error interno al obtener cotizaciones' });
  }
});

// Obtener una cotización por ID
router.get('/:id', async (req, res) => {
  const quoteId = req.params.id;

  try {
    const [quoteResult] = await db.query('SELECT * FROM quotes WHERE id = ?', [quoteId]);

    if (quoteResult.length === 0) {
      return res.status(404).json({ error: 'Cotización no encontrada' });
    }

    const quote = quoteResult[0];
    try {
      quote.items = typeof quote.items === 'string' ? JSON.parse(quote.items) : quote.items;
    } catch (e) {
      quote.items = [];
    }

    res.json(quote);
  } catch (err) {
    console.error('❌ Error al obtener la cotización:', err.message);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});

// Crear una nueva cotización
router.post('/', async (req, res) => {
  const { client, rif, phone, address, items, paymentMethod, currency, sellerId, date, status } = req.body;

  try {
    const [result] = await db.query(
      'INSERT INTO quotes (client, rif, phone, address, items, paymentMethod, currency, sellerId, date, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [client, rif, phone, address, JSON.stringify(items), paymentMethod, currency, sellerId, date, status || 'pendiente']
    );

    res.json({ id: result.insertId, message: 'Cotización guardada correctamente' });
  } catch (err) {
    console.error('❌ Error al guardar la cotización:', err.message);
    res.status(500).json({ error: 'Error al guardar cotización' });
  }
});

// Aprobar una cotización
router.put('/:id/approve', async (req, res) => {
  const quoteId = req.params.id;

  try {
    await db.query('UPDATE quotes SET status = ? WHERE id = ?', ['aprobada', quoteId]);
    res.json({ message: 'Cotización aprobada correctamente' });
  } catch (err) {
    console.error('❌ Error al aprobar cotización:', err.message);
    res.status(500).json({ error: 'Error al aprobar cotización' });
  }
});

// Marcar una cotización como devuelta
router.put('/:id/return', async (req, res) => {
  const quoteId = req.params.id;

  try {
    await db.query('UPDATE quotes SET status = ? WHERE id = ?', ['devuelta', quoteId]);
    res.json({ message: 'Cotización devuelta correctamente' });
  } catch (err) {
    console.error('❌ Error al devolver cotización:', err.message);
    res.status(500).json({ error: 'Error al devolver cotización' });
  }
});

module.exports = router;
