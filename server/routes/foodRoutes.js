const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const { verifyToken } = require('../middleware/auth');

router.get('/', foodController.getAllFoods);

router.get('/shop/:shopId', foodController.getFoodsByShopId);

router.get('/category/:categoryId', foodController.getFoodsByCategory);

router.get('/search', foodController.searchFoods);

router.get('/:foodId', foodController.getFoodById);

router.post('/', verifyToken, foodController.createFood);

router.put('/:foodId', verifyToken, foodController.updateFood);

router.delete('/:foodId', verifyToken, foodController.deleteFood);

router.patch('/:foodId/status', verifyToken, foodController.updateFoodStatus);

module.exports = router;
