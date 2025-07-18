const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener todos los productos
router.get('/', async (req, res) => {
  try {
    const [results] = await db.query('SELECT * FROM products');
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Obtener producto por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const [results] = await db.query('SELECT * FROM products WHERE id = ?', [id]);
    if (results.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(results[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Agregar un nuevo producto
router.post('/', async (req, res) => {
  const product = req.body;
  const query = `
    INSERT INTO products 
    (partNumber, name, brand, model, compatibleModels, price, cost, stock, location, warehouseId) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const values = [
    product.partNumber,
    product.name,
    product.brand,
    product.model,
    JSON.stringify(product.compatibleModels || []),
    product.price,
    product.cost,
    product.stock,
    product.location,
    product.warehouseId
  ];
  try {
    const [result] = await db.query(query, values);
    res.json({ id: result.insertId, ...product });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar producto
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const product = req.body;
  const query = `
    UPDATE products SET 
      partNumber = ?, name = ?, brand = ?, model = ?, compatibleModels = ?, 
      price = ?, cost = ?, stock = ?, location = ?, warehouseId = ? 
    WHERE id = ?`;
  const values = [
    product.partNumber,
    product.name,
    product.brand,
    product.model,
    JSON.stringify(product.compatibleModels || []),
    product.price,
    product.cost,
    product.stock,
    product.location,
    product.warehouseId,
    id
  ];
  try {
    await db.query(query, values);
    res.json({ message: 'Producto actualizado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Eliminar producto
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await db.query('DELETE FROM products WHERE id = ?', [id]);
    res.json({ message: 'Producto eliminado' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
