const express = require('express');
const router = express.Router();
const optionController = require('../controllers/optionController');
const authMiddleware = require('../middlewares/authMiddleware');

router.post('/groups', authMiddleware.verifyToken, authMiddleware.isSeller, optionController.createGroup);
router.post('/items', authMiddleware.verifyToken, authMiddleware.isSeller, optionController.addItem);
router.post('/assign', authMiddleware.verifyToken, authMiddleware.isSeller, optionController.assignToFood);

router.get('/food/:foodId', optionController.getFoodCustomization);

module.exports = router;