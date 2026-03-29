const express = require('express');
const router = express.Router();
const adminController = require('../controllers/AdminController');
const authMiddleware = require('../middlewares/authMiddleware');

router.use(authMiddleware.verifyToken, authMiddleware.isAdmin);

router.get('/pending-shops', adminController.getPendingShops);
router.patch('/approve-shop/:id', adminController.approveShop);
router.get('/categories', adminController.getCategories);
router.post('/categories', adminController.createCategory);
router.patch('/categories/:id/toggle', adminController.toggleCategory);
router.delete('/categories/:id', adminController.deleteCategory);

module.exports = router;