const db = require('../config/db');

const Cart = {
  async findByUserId(userId) {
    const [rows] = await db.query(
      'SELECT * FROM cart_items WHERE user_id = ?',
      [userId]
    );
    return rows.map(item => ({
      ...item,
      selected_options: typeof item.selected_options === 'string' 
        ? JSON.parse(item.selected_options) 
        : item.selected_options
    }));
  },

  async findItemById(cartItemId) {
    const [rows] = await db.query(
      'SELECT * FROM cart_items WHERE id = ?',
      [cartItemId]
    );
    if (rows[0]) {
      return {
        ...rows[0],
        selected_options: typeof rows[0].selected_options === 'string' 
          ? JSON.parse(rows[0].selected_options) 
          : rows[0].selected_options
      };
    }
    return null;
  },

  async addItem(cartData) {
    const { user_id, food_id, quantity, base_price, selected_options } = cartData;
    const total_price = quantity * base_price;
    
    const [result] = await db.query(
      'INSERT INTO cart_items (user_id, food_id, quantity, base_price, total_price, selected_options) VALUES (?, ?, ?, ?, ?, ?)',
      [user_id, food_id, quantity, base_price, total_price, JSON.stringify(selected_options || {})]
    );
    
    return this.findItemById(result.insertId);
  },

  async updateItem(cartItemId, updateData) {
    const { quantity, base_price, selected_options } = updateData;
    const total_price = quantity * base_price;
    
    await db.query(
      'UPDATE cart_items SET quantity = ?, base_price = ?, total_price = ?, selected_options = ? WHERE id = ?',
      [quantity, base_price, total_price, JSON.stringify(selected_options || {}), cartItemId]
    );
    
    return this.findItemById(cartItemId);
  },

  async removeItem(cartItemId) {
    await db.query('DELETE FROM cart_items WHERE id = ?', [cartItemId]);
    return { id: cartItemId };
  },

  async clearCart(userId) {
    await db.query('DELETE FROM cart_items WHERE user_id = ?', [userId]);
    return { userId };
  },

  async getTotal(userId) {
    const [rows] = await db.query(
      'SELECT SUM(total_price) as total, COUNT(*) as count FROM cart_items WHERE user_id = ?',
      [userId]
    );
    return rows[0] || { total: 0, count: 0 };
  }
};

module.exports = Cart;
