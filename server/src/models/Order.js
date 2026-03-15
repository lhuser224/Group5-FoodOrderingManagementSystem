const db = require('../config/db');

const Order = {
  async create(orderData) {
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      const { user_id, shop_id, total_price, items } = orderData;

      const [orderResult] = await connection.query(
        'INSERT INTO orders (user_id, shop_id, total_price, status) VALUES (?, ?, ?, ?)',
        [user_id, shop_id, total_price, 'pending']
      );

      const orderId = orderResult.insertId;

      for (const item of items) {
        await connection.query(
          'INSERT INTO order_items (order_id, food_id, quantity, base_price, total_price, selected_options) VALUES (?, ?, ?, ?, ?, ?)',
          [
            orderId,
            item.food_id,
            item.quantity,
            item.base_price || item.price,
            item.total_price || (item.quantity * (item.price || 0)),
            JSON.stringify(item.selected_options || {})
          ]
        );
      }

      await connection.commit();

      return {
        id: orderId,
        user_id,
        shop_id,
        total_price,
        status: 'pending',
        item_count: items.length
      };
    } catch (error) {
      if (connection) {
        await connection.rollback();
      }
      throw error;
    } finally {
      if (connection) connection.release();
    }
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM orders WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findByUserId(userId, filters = {}) {
    let query = 'SELECT * FROM orders WHERE user_id = ?';
    const params = [userId];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  async findByShopId(shopId, filters = {}) {
    let query = 'SELECT * FROM orders WHERE shop_id = ?';
    const params = [shopId];

    if (filters.status) {
      query += ' AND status = ?';
      params.push(filters.status);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  async findAll(filters = {}) {
    let query = 'SELECT * FROM orders';
    const params = [];

    if (filters.status) {
      query += ' WHERE status = ?';
      params.push(filters.status);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  async updateStatus(id, status) {
    await db.query('UPDATE orders SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  },

  async cancel(id) {
    const order = await this.findById(id);
    if (order.status !== 'pending') {
      throw new Error('Can only cancel pending orders');
    }
    return this.updateStatus(id, 'cancelled');
  },

  async getItems(orderId) {
    const [rows] = await db.query(
      'SELECT * FROM order_items WHERE order_id = ?',
      [orderId]
    );
    return rows.map(item => ({
      ...item,
      selected_options: typeof item.selected_options === 'string' 
        ? JSON.parse(item.selected_options) 
        : item.selected_options
    }));
  }
};

module.exports = Order;
