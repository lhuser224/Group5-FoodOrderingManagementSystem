const cartService = require('../services/cartService');

const cartController = {
  async getByUserId(req, res) {
    try {
      const userId = req.user.id;

      const result = await cartService.getByUserId(userId);

      res.status(200).json({
        success: true,
        message: 'Cart items retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  async addItem(req, res) {
    try {
      const userId = req.user.id;
      const { food_id, quantity, selected_options } = req.body;

      if (!food_id || !quantity) {
        return res.status(400).json({
          success: false,
          message: 'Food ID and quantity are required',
          data: null
        });
      }

      const result = await cartService.addItem(userId, {
        food_id: parseInt(food_id),
        quantity: parseInt(quantity),
        selected_options
      });

      res.status(201).json({
        success: true,
        message: 'Item added to cart successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  async updateItem(req, res) {
    try {
      const userId = req.user.id;
      const { cartItemId } = req.params;
      const { quantity, selected_options } = req.body;

      if (!quantity) {
        return res.status(400).json({
          success: false,
          message: 'Quantity is required',
          data: null
        });
      }

      const result = await cartService.updateItem(userId, parseInt(cartItemId), {
        quantity: parseInt(quantity),
        selected_options
      });

      res.status(200).json({
        success: true,
        message: 'Cart item updated successfully',
        data: result
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message,
          data: null
        });
      }

      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  async removeItem(req, res) {
    try {
      const userId = req.user.id;
      const { cartItemId } = req.params;

      await cartService.removeItem(userId, parseInt(cartItemId));

      res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully',
        data: null
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message,
          data: null
        });
      }

      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  async clear(req, res) {
    try {
      const userId = req.user.id;

      await cartService.clear(userId);

      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully',
        data: null
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  async getTotal(req, res) {
    try {
      const userId = req.user.id;

      const result = await cartService.getTotal(userId);

      res.status(200).json({
        success: true,
        message: 'Cart total retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }
};

module.exports = cartController;
