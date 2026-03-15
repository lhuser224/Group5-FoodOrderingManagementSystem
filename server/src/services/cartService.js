const Cart = require('../models/Cart');
const Food = require('../models/Food');

const cartService = {
  async getByUserId(userId) {
    const items = await Cart.findByUserId(userId);
    const enrichedItems = [];

    for (const item of items) {
      const food = await Food.findById(item.food_id);
      enrichedItems.push({
        ...item,
        food
      });
    }

    return enrichedItems;
  },

  async addItem(userId, itemData) {
    const food = await Food.findById(itemData.food_id);
    if (!food) {
      throw new Error('Food not found');
    }

    if (itemData.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const cartItem = await Cart.addItem({
      user_id: userId,
      food_id: itemData.food_id,
      quantity: itemData.quantity,
      base_price: food.price,
      selected_options: itemData.selected_options || {}
    });

    return {
      ...cartItem,
      food
    };
  },

  async updateItem(userId, cartItemId, updateData) {
    const cartItem = await Cart.findItemById(cartItemId);
    if (!cartItem || cartItem.user_id !== userId) {
      throw new Error('Cart item not found');
    }

    const food = await Food.findById(cartItem.food_id);
    if (!food) {
      throw new Error('Food not found');
    }

    if (updateData.quantity <= 0) {
      throw new Error('Quantity must be greater than 0');
    }

    const updatedItem = await Cart.updateItem(cartItemId, {
      quantity: updateData.quantity,
      base_price: food.price,
      selected_options: updateData.selected_options || {}
    });

    return {
      ...updatedItem,
      food
    };
  },

  async removeItem(userId, cartItemId) {
    const cartItem = await Cart.findItemById(cartItemId);
    if (!cartItem || cartItem.user_id !== userId) {
      throw new Error('Cart item not found');
    }

    return await Cart.removeItem(cartItemId);
  },

  async clear(userId) {
    return await Cart.clearCart(userId);
  },

  async getTotal(userId) {
    return await Cart.getTotal(userId);
  }
};

module.exports = cartService;
