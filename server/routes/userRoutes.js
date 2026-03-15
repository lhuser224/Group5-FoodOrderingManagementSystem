const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

/**
 * Public Routes
 */

/**
 * POST /auth/login
 * Login user with phone and password
 * Returns: { success, message, data: { user_id, phone, full_name, role, token } }
 */
router.post('/login', authController.login);

/**
 * POST /auth/register
 * Register new user
 * Returns: { success, message, data: { user_id, phone, full_name, role, token } }
 */
router.post('/register', authController.register);

/**
 * Protected Routes (require JWT token)
 */

/**
 * GET /auth/profile
 * Get current user profile (requires authentication)
 * Returns: { success, data: { id, phone, full_name, role, status, created_at } }
 */
router.get('/profile', verifyToken, authController.getProfile);

/**
 * PUT /auth/profile
 * Update current user profile (requires authentication)
 * Body: { full_name?, status? }
 * Returns: { success, message, data: { id, phone, full_name, role, status, created_at } }
 */
router.put('/profile', verifyToken, authController.updateProfile);

module.exports = router;
