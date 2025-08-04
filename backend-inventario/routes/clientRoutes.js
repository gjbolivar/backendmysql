const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener todos los clientes
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM clients ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('❌ Error al obtener clientes:', err.message);
    res.status(500).json({ error: 'Error al obtener clientes' });
  }
});

// Crear nuevo cliente
router.post('/', async (req, res) => {
  const { name, rif, phone, address } = req.body;
  try {
    const [result] = await db.query(
      'INSERT INTO clients (name, rif, phone, address) VALUES (?, ?, ?, ?)',
      [name, rif, phone, address]
    );
    res.status(201).json({ id: result.insertId, name, rif, phone, address });
  } catch (err) {
    console.error('❌ Error al crear cliente:', err.message);
    res.status(500).json({ error: 'Error al crear cliente' });
  }
});

// Editar cliente existente
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, rif, phone, address } = req.body;
  try {
    await db.query(
      'UPDATE clients SET name = ?, rif = ?, phone = ?, address = ? WHERE id = ?',
      [name, rif, phone, address, id]
    );
    res.json({ id, name, rif, phone, address });
  } catch (err) {
    console.error('❌ Error al actualizar cliente:', err.message);
    res.status(500).json({ error: 'Error al actualizar cliente' });
  }
});

// Eliminar cliente
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM clients WHERE id = ?', [id]);
    res.json({ success: true });
  } catch (err) {
    console.error('❌ Error al eliminar cliente:', err.message);
    res.status(500).json({ error: 'Error al eliminar cliente' });
  }
});

module.exports = router;
