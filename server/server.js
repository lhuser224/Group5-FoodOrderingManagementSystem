const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const shopRoutes = require('./routes/shopRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const cartRoutes = require('./routes/cartRoutes');
const adminRoutes = require('./routes/adminRoutes');
const statsRoutes = require('./routes/statsRoutes');
const addressRoutes = require('./routes/addressRoutes');
const optionGroupRoutes = require('./routes/optionGroupRoutes');
const optionItemRoutes = require('./routes/optionItemRoutes');
const foodOptionRoutes = require('./routes/foodOptionRoutes');
const sellerRoutes = require('./routes/sellerRoutes');

const userModel = require('./models/userModel');

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../client/dist')));

const initializeApp = async () => {
  try {
    await userModel.init();
    console.log('✓ App initialized successfully');
  } catch (error) {
    console.error('✗ Error initializing app:', error.message);
  }
};

initializeApp();

app.use('/FoodO/api/auth', authRoutes);
app.use('/FoodO/api/users', userRoutes);
app.use('/FoodO/api/foods', foodRoutes);
app.use('/FoodO/api/orders', orderRoutes);
app.use('/FoodO/api/shops', shopRoutes);
app.use('/FoodO/api/categories', categoryRoutes);
app.use('/FoodO/api/cart', cartRoutes);
app.use('/FoodO/api/admin', adminRoutes);
app.use('/FoodO/api/stats', statsRoutes);
app.use('/FoodO/api/addresses', addressRoutes);
app.use('/FoodO/api/option-groups', optionGroupRoutes);
app.use('/FoodO/api/option-items', optionItemRoutes);
app.use('/FoodO/api/food-options', foodOptionRoutes);
app.use('/FoodO/api/seller', sellerRoutes); 

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n${'='.repeat(50)}`);
  console.log(`✓ Server running at http://localhost:${PORT}`);
  console.log(`${'='.repeat(50)}\n`);
});