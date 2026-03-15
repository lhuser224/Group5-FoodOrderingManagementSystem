const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const { validateFood } = require('../middleware/foodValidator'); // Import middleware

router.post('/:shopId/add-food', validateFood, foodController.addFood);
router.get('/:shopId/foods', foodController.getShopFoods);

module.exports = router;