require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

const { sequelize } = require('./src/models');

const authRoutes = require('./src/routes/auth');
const productRoutes = require('./src/routes/products');
const orderRoutes = require('./src/routes/orders');
const dashboardRoutes = require('./src/routes/dashboard');
const reportRoutes = require('./src/routes/reports');

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

const limiter = rateLimit({ windowMs: 1 * 60 * 1000, max: 200 });
app.use(limiter);

app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportRoutes);

app.get('/', (req, res) => res.json({ status: 'QuickBill API' }));

const PORT = process.env.PORT || 4000;

async function start(){
  try{
    await sequelize.authenticate();
    await sequelize.sync({ alter: true });
    app.listen(PORT, ()=> console.log(`Server running on port ${PORT}`));
  }catch(err){
    console.error('Failed to start', err);
    process.exit(1);
  }
}

start();

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ message: err.message || 'Server error' });
});
