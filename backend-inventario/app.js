const express = require('express');
const cors = require('cors');
const app = express();
const productRoutes = require('./routes/productRoutes');
const quoteRoutes = require('./routes/quoteRoutes'); 
const clientRoutes = require('./routes/clientRoutes');
const sellerRoutes = require('./routes/sellerRoutes');
const deliveryRoutes = require('./routes/deliveryRoutes');
const currencyRoutes = require('./routes/currencyRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.use('/api/products', productRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/clients', clientRoutes); 
app.use('/api/sellers', sellerRoutes);
app.use('/api/deliveries', deliveryRoutes);
app.use('/api/currencies', currencyRoutes);
app.use('/api/warehouses', warehouseRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
