const express = require('express');
const router = express.Router();
const db = require('../database');

// Obtener todos los productos
router.get('/', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// Obtener un producto por ID
router.get('/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM products WHERE id = ?', [id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0) return res.status(404).json({ error: 'Producto no encontrado' });
    res.json(results[0]);
  });
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
  const product = req.body;

  console.log('📦 Datos recibidos para guardar:', product);
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
  db.query(query, values, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: result.insertId, ...product });
  });
});

// Editar producto
router.put('/:id', (req, res) => {
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
  db.query(query, values, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Producto actualizado' });
  });
});

// Eliminar producto
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM products WHERE id = ?', [id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Producto eliminado' });
  });
});

module.exports = router;
