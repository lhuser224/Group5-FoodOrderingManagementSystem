const express = require('express');
const shopController = require('../controllers/shopController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/', shopController.getAll);
router.get('/:id', shopController.getById);

router.post('/', authMiddleware.verifyToken, authMiddleware.isAdmin, shopController.create);
router.patch('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, shopController.update);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, shopController.delete);

module.exports = router;
