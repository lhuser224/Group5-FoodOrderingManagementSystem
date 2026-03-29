const express = require('express');
const shopController = require('../controllers/shopController');
const authMiddleware = require('../middlewares/authMiddleware');
const upload = require('../middlewares/uploadMiddleware');
const router = express.Router();

// --- PUBLIC ROUTES ---
router.get('/', shopController.getAll);
// Đưa /me/info lên trước /:id để tránh bị Express hiểu lầm 'me' là một cái ID
router.get('/me/info', authMiddleware.verifyToken, shopController.getMyShop);
router.get('/:id', shopController.getById);

// --- PRIVATE ROUTES (USER LOGIN) ---
router.post('/', authMiddleware.verifyToken, upload.single('license_image'), shopController.create);
router.patch('/:id/toggle-open', authMiddleware.verifyToken, shopController.toggleOpen);

// --- ADMIN & OWNER ROUTES ---
router.patch('/:id/approve', authMiddleware.verifyToken, authMiddleware.isAdmin, shopController.approve);
router.patch('/:id', authMiddleware.verifyToken, upload.single('image_url'), shopController.update);
router.delete('/:id', authMiddleware.verifyToken, authMiddleware.isAdmin, shopController.delete);

module.exports = router;