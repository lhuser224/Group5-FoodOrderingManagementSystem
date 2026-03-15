const cartModel = require('../models/cartModel');

const cartController = {
  async getCart(req, res) {
    try {
      const userId = req.user.id;

      const cartItems = await cartModel.getCartByUserId(userId);

      const total = await cartModel.getCartTotal(userId);
      const count = await cartModel.getCartCount(userId);

      res.status(200).json({
        success: true,
        data: cartItems.map(item => ({
          ...item,
          selected_options: typeof item.selected_options === 'string' 
            ? JSON.parse(item.selected_options) 
            : item.selected_options
        })),
        total,
        count
      });
    } catch (error) {
      console.error('Get cart error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching cart',
        error: error.message
      });
    }
  },

  async getCartItem(req, res) {
    try {
      const { cartItemId } = req.params;

      if (!cartItemId) {
        return res.status(400).json({
          success: false,
          message: 'Cart item ID is required'
        });
      }

      const cartItem = await cartModel.getCartItemById(cartItemId);

      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Cart item not found'
        });
      }

      const item = {
        ...cartItem,
        selected_options: typeof cartItem.selected_options === 'string' 
          ? JSON.parse(cartItem.selected_options) 
          : cartItem.selected_options
      };

      res.status(200).json({
        success: true,
        data: item
      });
    } catch (error) {
      console.error('Get cart item error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching cart item',
        error: error.message
      });
    }
  },

  async addToCart(req, res) {
    try {
      const userId = req.user.id;
      const { food_id, quantity, base_price, selected_options } = req.body;

      if (!food_id || !quantity || !base_price) {
        return res.status(400).json({
          success: false,
          message: 'food_id, quantity, and base_price are required'
        });
      }

      if (quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be greater than 0'
        });
      }

      if (base_price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price cannot be negative'
        });
      }

      const newItem = await cartModel.addToCart({
        user_id: userId,
        food_id,
        quantity,
        base_price,
        selected_options: selected_options || {}
      });

      res.status(201).json({
        success: true,
        message: 'Item added to cart',
        data: newItem
      });
    } catch (error) {
      console.error('Add to cart error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error adding to cart',
        error: error.message
      });
    }
  },

  async updateCartItem(req, res) {
    try {
      const { cartItemId } = req.params;
      const { quantity, base_price, selected_options } = req.body;

      if (!cartItemId) {
        return res.status(400).json({
          success: false,
          message: 'Cart item ID is required'
        });
      }

      if (!quantity && !base_price && !selected_options) {
        return res.status(400).json({
          success: false,
          message: 'No data to update'
        });
      }

      const cartItem = await cartModel.getCartItemById(cartItemId);
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Cart item not found'
        });
      }

      const updateData = {
        quantity: quantity || cartItem.quantity,
        base_price: base_price || cartItem.base_price,
        selected_options: selected_options || (typeof cartItem.selected_options === 'string' 
          ? JSON.parse(cartItem.selected_options) 
          : cartItem.selected_options)
      };

      if (updateData.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be greater than 0'
        });
      }

      if (updateData.base_price < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price cannot be negative'
        });
      }

      await cartModel.updateCartItem(cartItemId, updateData);

      const updated = await cartModel.getCartItemById(cartItemId);

      res.status(200).json({
        success: true,
        message: 'Cart item updated',
        data: {
          ...updated,
          selected_options: typeof updated.selected_options === 'string' 
            ? JSON.parse(updated.selected_options) 
            : updated.selected_options
        }
      });
    } catch (error) {
      console.error('Update cart item error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error updating cart item',
        error: error.message
      });
    }
  },

  async removeFromCart(req, res) {
    try {
      const { cartItemId } = req.params;

      if (!cartItemId) {
        return res.status(400).json({
          success: false,
          message: 'Cart item ID is required'
        });
      }

      const cartItem = await cartModel.getCartItemById(cartItemId);
      if (!cartItem) {
        return res.status(404).json({
          success: false,
          message: 'Cart item not found'
        });
      }

      await cartModel.removeFromCart(cartItemId);

      res.status(200).json({
        success: true,
        message: 'Item removed from cart',
        data: { id: cartItemId }
      });
    } catch (error) {
      console.error('Remove from cart error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error removing from cart',
        error: error.message
      });
    }
  },

  async clearCart(req, res) {
    try {
      const userId = req.user.id;

      await cartModel.clearCart(userId);

      res.status(200).json({
        success: true,
        message: 'Cart cleared successfully'
      });
    } catch (error) {
      console.error('Clear cart error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error clearing cart',
        error: error.message
      });
    }
  },

  async getCartTotal(req, res) {
    try {
      const userId = req.user.id;

      const total = await cartModel.getCartTotal(userId);
      const count = await cartModel.getCartCount(userId);

      res.status(200).json({
        success: true,
        data: {
          total,
          count,
          items: count
        }
      });
    } catch (error) {
      console.error('Get cart total error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error calculating cart total',
        error: error.message
      });
    }
  }
};

module.exports = cartController;
