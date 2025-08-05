const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener todos los vendedores
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM vendors');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Crear nuevo vendedor
router.post('/', async (req, res) => {
  const { name, contact, email, phone } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO vendors (name, contact, email, phone) VALUES (?, ?, ?, ?)',
      [name, contact, email, phone]
    );
    res.json({ id: result.insertId, name, contact, email, phone });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar vendedor
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM vendors WHERE id = ?', [id]);
    res.json({ message: 'Vendedor eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;

