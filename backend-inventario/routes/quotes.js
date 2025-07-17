// routes/products.js
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.send('Productos funcionando correctamente');
});

module.exports = router;
