const express = require('express');
const cors = require('cors');
const app = express();
const productRoutes = require('./routes/products');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('API funcionando correctamente');
});

app.use('/api/products', productRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
