const db = require('../config/db');

const cartModel = {
  async getCartByUserId(userId) {
    try {
      const [cartItems] = await db.query(
        'SELECT * FROM cart_items WHERE user_id = ? ORDER BY id DESC',
        [userId]
      );
      return cartItems;
    } catch (error) {
      console.error('Error fetching cart:', error.message);
      throw error;
    }
  },

  async getCartItemById(cartItemId) {
    try {
      const [items] = await db.query(
        'SELECT * FROM cart_items WHERE id = ?',
        [cartItemId]
      );
      return items.length > 0 ? items[0] : null;
    } catch (error) {
      console.error('Error fetching cart item:', error.message);
      throw error;
    }
  },

  async addToCart(cartData) {
    try {
      const { user_id, food_id, quantity, base_price, selected_options = {} } = cartData;

      if (!user_id || !food_id || !quantity) {
        throw new Error('user_id, food_id, and quantity are required');
      }

      const total_price = quantity * base_price;

      const [result] = await db.query(
        'INSERT INTO cart_items (user_id, food_id, quantity, base_price, total_price, selected_options) VALUES (?, ?, ?, ?, ?, ?)',
        [user_id, food_id, quantity, base_price, total_price, JSON.stringify(selected_options)]
      );

      return {
        id: result.insertId,
        user_id,
        food_id,
        quantity,
        base_price,
        total_price,
        selected_options
      };
    } catch (error) {
      console.error('Error adding to cart:', error.message);
      throw error;
    }
  },

  async updateCartItem(cartItemId, updateData) {
    try {
      const { quantity, base_price, selected_options } = updateData;

      const total_price = quantity * base_price;

      const [result] = await db.query(
        'UPDATE cart_items SET quantity = ?, base_price = ?, total_price = ?, selected_options = ? WHERE id = ?',
        [quantity, base_price, total_price, JSON.stringify(selected_options), cartItemId]
      );

      return result;
    } catch (error) {
      console.error('Error updating cart item:', error.message);
      throw error;
    }
  },

  async removeFromCart(cartItemId) {
    try {
      const [result] = await db.query(
        'DELETE FROM cart_items WHERE id = ?',
        [cartItemId]
      );
      return result;
    } catch (error) {
      console.error('Error removing from cart:', error.message);
      throw error;
    }
  },

  async clearCart(userId) {
    try {
      const [result] = await db.query(
        'DELETE FROM cart_items WHERE user_id = ?',
        [userId]
      );
      return result;
    } catch (error) {
      console.error('Error clearing cart:', error.message);
      throw error;
    }
  },

  async getCartTotal(userId) {
    try {
      const [result] = await db.query(
        'SELECT SUM(total_price) as total FROM cart_items WHERE user_id = ?',
        [userId]
      );
      return result[0].total || 0;
    } catch (error) {
      console.error('Error calculating cart total:', error.message);
      throw error;
    }
  },

  async getCartCount(userId) {
    try {
      const [result] = await db.query(
        'SELECT COUNT(*) as count FROM cart_items WHERE user_id = ?',
        [userId]
      );
      return result[0].count;
    } catch (error) {
      console.error('Error getting cart count:', error.message);
      throw error;
    }
  }
};

module.exports = cartModel;
