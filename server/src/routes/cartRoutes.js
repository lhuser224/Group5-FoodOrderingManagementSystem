const express = require('express');
const cartController = require('../controllers/cartController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.use(authMiddleware.verifyToken, authMiddleware.isCustomer);

router.get('/', cartController.getByUserId);
router.get('/total', cartController.getTotal);

router.post('/', cartController.addItem);
router.patch('/:cartItemId', cartController.updateItem);
router.delete('/:cartItemId', cartController.removeItem);
router.delete('/', cartController.clear);

module.exports = router;
