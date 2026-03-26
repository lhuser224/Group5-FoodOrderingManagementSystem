const express = require('express');
const shopController = require('../controllers/shopController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

router.get('/', shopController.getAll);
router.get('/:id', shopController.getById);

router.post('/', authMiddleware.verifyToken, upload.single('license_image'), shopController.create);
router.patch('/:id/approve', authMiddleware.verifyToken, authMiddleware.isAdmin, shopController.approve);
router.patch('/:id', authMiddleware.verifyToken, shopController.update);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, shopController.delete);

module.exports = router;