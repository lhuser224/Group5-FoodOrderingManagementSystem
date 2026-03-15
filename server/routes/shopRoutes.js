const express = require('express');
const router = express.Router();
const shopController = require('../controllers/shopController');
const { verifyToken } = require('../middleware/auth');

router.get('/', shopController.getAllShops);

router.get('/:shopId', shopController.getShopById);

router.get('/:shopId/foods', shopController.getShopFoods);

router.post('/', verifyToken, shopController.createShop);

router.put('/:shopId', verifyToken, shopController.updateShop);

router.delete('/:shopId', verifyToken, shopController.deleteShop);

module.exports = router;
