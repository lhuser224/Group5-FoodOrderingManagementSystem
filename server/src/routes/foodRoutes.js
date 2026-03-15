const express = require('express');
const foodController = require('../controllers/foodController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', foodController.getAll);
router.get('/:id', foodController.getById);
router.get('/shop/:shopId', foodController.getByShop);
router.get('/category/:categoryId', foodController.getByCategory);

router.post('/', authMiddleware.verifyToken, authMiddleware.isSeller, foodController.create);
router.patch('/:id', authMiddleware.verifyToken, authMiddleware.isSeller, foodController.update);
router.patch('/:id/toggle', authMiddleware.verifyToken, authMiddleware.isSeller, foodController.toggleStatus);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isSeller, foodController.delete);

module.exports = router;
