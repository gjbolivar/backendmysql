const express = require('express');
const cors = require('cors');
const app = express();
const productRoutes = require('./routes/productRoutes');
const quoteRoutes = require('./routes/quoteRoutes'); 
const clientRoutes = require('./routes/clientRoutes');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.use('/api/products', productRoutes);
app.use('/api/quotes', quoteRoutes);
app.use('/api/clients', clientRoutes); 

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
