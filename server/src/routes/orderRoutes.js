const express = require('express');
const orderController = require('../controllers/orderController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/', authMiddleware.verifyToken, authMiddleware.isCustomer, orderController.create);
router.get('/user/orders', authMiddleware.verifyToken, authMiddleware.isCustomer, orderController.getByUserId);
router.get('/shop/:shopId', authMiddleware.verifyToken, authMiddleware.isSeller, orderController.getByShopId);
router.get('/:id', authMiddleware.verifyToken, orderController.getById);

router.patch('/:id/status', authMiddleware.verifyToken, authMiddleware.isSeller, orderController.updateStatus);
router.patch('/:id/cancel', authMiddleware.verifyToken, orderController.cancel);

module.exports = router;
