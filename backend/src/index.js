require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { sequelize } = require('./models'); 

const app = express();

//  Configurar CORS correctamente para permitir solo tu front
app.use(cors({
  origin: process.env.FRONTEND_ORIGIN || "http://localhost:4200"
}));

app.use(express.json());

// Ruta base 
app.get('/', (req, res) => {
  res.send('API de ecommerce funcionando 🚀');
});

// Rutas del proyecto
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const orderProductRoutes = require('./routes/orderProductRoutes');
const checkoutRoutes = require('./routes/checkoutRoutes'); // Stripe 

app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/orderProducts', orderProductRoutes);
app.use('/api/checkout', checkoutRoutes);

// Conexión a la base de datos
sequelize.authenticate()
  .then(() => console.log('✅ Conexión a la base de datos establecida'))
  .catch(err => console.error('❌ Error de conexión:', err));

sequelize.sync({ alter: true }) // solo para desarrollo
  .then(() => console.log('🔄 Modelos sincronizados con la base de datos'))
  .catch(err => console.error('❌ Error al sincronizar modelos:', err));

// Servidor escuchando
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en puerto ${PORT}`);
});
