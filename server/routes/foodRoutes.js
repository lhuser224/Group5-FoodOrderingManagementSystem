const express = require('express');
const router = express.Router();
const foodController = require('../controllers/foodController');
const { verifyToken } = require('../middleware/auth');

/**
 * PUBLIC ROUTES
 */

/**
 * GET /FoodO/api/foods
 * Get all foods with optional filters
 * Query params: categoryId, status, search
 * Returns: { success, data: [...], count }
 */
router.get('/', foodController.getAllFoods);

/**
 * GET /FoodO/api/foods/shop/:shopId
 * Get all foods for a specific shop
 * Returns: { success, data: [...], count }
 */
router.get('/shop/:shopId', foodController.getFoodsByShopId);

/**
 * GET /FoodO/api/foods/category/:categoryId
 * Get all foods in a specific category
 * Returns: { success, data: [...], count }
 */
router.get('/category/:categoryId', foodController.getFoodsByCategory);

/**
 * GET /FoodO/api/foods/search
 * Search foods by name
 * Query params: term
 * Returns: { success, data: [...], count }
 */
router.get('/search', foodController.searchFoods);

/**
 * GET /FoodO/api/foods/:foodId
 * Get food by ID
 * Returns: { success, data: {...} }
 */
router.get('/:foodId', foodController.getFoodById);

/**
 * PROTECTED ROUTES (require authentication)
 */

/**
 * POST /FoodO/api/foods
 * Create a new food item (requires auth)
 * Body: { name, price, image_url?, shop_id, category_id?, status? }
 * Returns: { success, message, data: {...} }
 */
router.post('/', verifyToken, foodController.createFood);

/**
 * PUT /FoodO/api/foods/:foodId
 * Update a food item (requires auth)
 * Body: { name?, price?, image_url?, category_id?, status? }
 * Returns: { success, message, data: {...} }
 */
router.put('/:foodId', verifyToken, foodController.updateFood);

/**
 * DELETE /FoodO/api/foods/:foodId
 * Delete a food item (requires auth)
 * Returns: { success, message, data: { id } }
 */
router.delete('/:foodId', verifyToken, foodController.deleteFood);

/**
 * PATCH /FoodO/api/foods/:foodId/status
 * Update food status (requires auth)
 * Body: { status: 'available' | 'unavailable' | 'deleted' }
 * Returns: { success, message, data: {...} }
 */
router.patch('/:foodId/status', verifyToken, foodController.updateFoodStatus);

module.exports = router;
