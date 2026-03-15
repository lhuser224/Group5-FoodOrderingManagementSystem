const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middleware/auth');

router.post('/', verifyToken, orderController.createOrder);

router.get('/', verifyToken, orderController.getUserOrders);

router.get('/all', orderController.getAllOrders);

router.get('/shop/:shopId', orderController.getShopOrders);

router.get('/:orderId', verifyToken, orderController.getOrderById);

router.get('/:orderId/items', verifyToken, orderController.getOrderItems);

router.patch('/:orderId/status', verifyToken, orderController.updateOrderStatus);

router.patch('/:orderId/cancel', verifyToken, orderController.cancelOrder);

module.exports = router;
