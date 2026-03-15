const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { verifyToken } = require('../middleware/auth');

router.get('/', categoryController.getAllCategories);

router.get('/:categoryId', categoryController.getCategoryById);

router.get('/:categoryId/foods', categoryController.getCategoryFoods);

router.post('/', verifyToken, categoryController.createCategory);

router.put('/:categoryId', verifyToken, categoryController.updateCategory);

router.delete('/:categoryId', verifyToken, categoryController.deleteCategory);

module.exports = router;
