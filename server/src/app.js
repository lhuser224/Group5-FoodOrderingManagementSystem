const cors = require('cors');
const path = require('path');
const express = require('express');
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shopRoutes = require('./routes/shopRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const optionRoutes = require('./routes/optionRoutes');
const adminRoutes = require('./routes/AdminRoutes');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
const foodORouter = express.Router();

foodORouter.use('/admin', adminRoutes);
foodORouter.use('/auth', authRoutes);
foodORouter.use('/foods', foodRoutes);
foodORouter.use('/orders', orderRoutes);
foodORouter.use('/shops', shopRoutes);
foodORouter.use('/categories', categoryRoutes);
foodORouter.use('/cart', cartRoutes);
foodORouter.use('/options', optionRoutes);

foodORouter.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'FoodO Server is running',
    data: null
  });
});

app.use('/api/FoodO', foodORouter);

module.exports = app;