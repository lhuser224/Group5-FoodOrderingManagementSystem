const express = require('express');
const authController = require('../controllers/authController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

router.post('/register', authController.register);
router.post('/login', authController.login);

router.put('/profile', authMiddleware.verifyToken, authController.handleUpdateProfile);
router.put('/change-password', authMiddleware.verifyToken, authController.handleChangePassword);

module.exports = router;