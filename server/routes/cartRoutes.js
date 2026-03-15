const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { verifyToken } = require('../middleware/auth');

router.get('/', verifyToken, cartController.getCart);

router.get('/item/:cartItemId', verifyToken, cartController.getCartItem);

router.get('/total', verifyToken, cartController.getCartTotal);

router.post('/', verifyToken, cartController.addToCart);

router.put('/:cartItemId', verifyToken, cartController.updateCartItem);

router.delete('/:cartItemId', verifyToken, cartController.removeFromCart);

router.delete('/', verifyToken, cartController.clearCart);

module.exports = router;
