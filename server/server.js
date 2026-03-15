const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();

const sellerRoutes = require('./routes/sellerRoutes');
const authRoutes = require('./routes/authRoutes');
const foodRoutes = require('./routes/foodRoutes');
const orderRoutes = require('./routes/orderRoutes');
const adminRoutes = require('./routes/adminRoutes');
const statsRoutes = require('./routes/statsRoutes');
const addressRoutes = require('./routes/addressRoutes');
const optionGroupRoutes = require('./routes/optionGroupRoutes');
const optionItemRoutes = require('./routes/optionItemRoutes');
const foodOptionRoutes = require('./routes/foodOptionRoutes');
const db = require('./config/db');

app.use(cors());
app.use(express.json()); 
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '../client/dist')));

app.use('/FoodO/api/auth', authRoutes);
app.use('/FoodO/api/foods', foodRoutes);
app.use('/FoodO/api/orders', orderRoutes);
app.use('/FoodO/api/admin', adminRoutes);
app.use('/FoodO/api/stats', statsRoutes);
app.use('/FoodO/api/addresses', addressRoutes);
app.use('/FoodO/api/option-groups', optionGroupRoutes);
app.use('/FoodO/api/option-items', optionItemRoutes);
app.use('/FoodO/api/food-options', foodOptionRoutes);
app.use('/FoodO/api/seller', sellerRoutes); 
//https://stackoverflow.com/questions/79553495/throw-new-typeerrormissing-parameter-name-at-i-debug-url
app.get('/{*any}', (req, res) => {
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));