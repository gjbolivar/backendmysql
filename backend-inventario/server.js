require('dotenv').config();

const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const quoteRoutes = require('./routes/quoteRoutes'); // ✅ Importar rutas de cotizaciones

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Rutas API
app.use('/api/products', productRoutes);
app.use('/api/quotes', quoteRoutes); // ✅ Usar rutas de cotizaciones

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend corriendo en el puerto ${PORT}`);
});
