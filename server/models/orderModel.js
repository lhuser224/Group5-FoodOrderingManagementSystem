const db = require('../config/db');

const orderModel = {
  async createOrderWithItems(orderData) {
    let connection;
    try {
      connection = await db.getConnection();
      await connection.beginTransaction();

      const { user_id, shop_id, total_price, items } = orderData;

      if (!user_id || !shop_id || !items || items.length === 0) {
        throw new Error('user_id, shop_id, and items are required');
      }

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
      console.error('Error creating order with items:', error.message);
      throw error;
    } finally {
      if (connection) {
        connection.release();
      }
    }
  },

  async getOrderById(orderId) {
    try {
      const [orders] = await db.query(
        'SELECT * FROM orders WHERE id = ?',
        [orderId]
      );

      if (orders.length === 0) {
        return null;
      }

      const order = orders[0];

      const [items] = await db.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [orderId]
      );

      return {
        ...order,
        items: items.map(item => ({
          ...item,
          selected_options: typeof item.selected_options === 'string' 
            ? JSON.parse(item.selected_options) 
            : item.selected_options
        }))
      };
    } catch (error) {
      console.error('Error fetching order by ID:', error.message);
      throw error;
    }
  },

  async getOrdersByUserId(userId, filters = {}) {
    try {
      let query = 'SELECT * FROM orders WHERE user_id = ?';
      const params = [userId];

      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      query += ' ORDER BY created_at DESC';

      const [orders] = await db.query(query, params);
      return orders;
    } catch (error) {
      console.error('Error fetching user orders:', error.message);
      throw error;
    }
  },

  async getOrdersByShopId(shopId, filters = {}) {
    try {
      let query = 'SELECT * FROM orders WHERE shop_id = ?';
      const params = [shopId];

      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      query += ' ORDER BY created_at DESC';

      const [orders] = await db.query(query, params);
      return orders;
    } catch (error) {
      console.error('Error fetching shop orders:', error.message);
      throw error;
    }
  },

  async getAllOrders(filters = {}) {
    try {
      let query = 'SELECT * FROM orders WHERE 1=1';
      const params = [];

      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      if (filters.shop_id) {
        query += ' AND shop_id = ?';
        params.push(filters.shop_id);
      }

      query += ' ORDER BY created_at DESC';

      const [orders] = await db.query(query, params);
      return orders;
    } catch (error) {
      console.error('Error fetching all orders:', error.message);
      throw error;
    }
  },

  async updateOrderStatus(orderId, status) {
    try {
      const validStatuses = ['pending', 'confirmed', 'shipping', 'completed', 'cancelled'];
      
      if (!validStatuses.includes(status)) {
        throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
      }

      const [result] = await db.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, orderId]
      );

      return result;
    } catch (error) {
      console.error('Error updating order status:', error.message);
      throw error;
    }
  },

  async cancelOrder(orderId) {
    try {
      const [orders] = await db.query(
        'SELECT status FROM orders WHERE id = ?',
        [orderId]
      );

      if (orders.length === 0) {
        throw new Error('Order not found');
      }

      if (orders[0].status !== 'pending') {
        throw new Error('Can only cancel pending orders');
      }

      const [result] = await db.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        ['cancelled', orderId]
      );

      return result;
    } catch (error) {
      console.error('Error cancelling order:', error.message);
      throw error;
    }
  },

  async getOrderItems(orderId) {
    try {
      const [items] = await db.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [orderId]
      );

      return items.map(item => ({
        ...item,
        selected_options: typeof item.selected_options === 'string' 
          ? JSON.parse(item.selected_options) 
          : item.selected_options
      }));
    } catch (error) {
      console.error('Error fetching order items:', error.message);
      throw error;
    }
  },

  async deleteOrder(orderId) {
    try {
      const [result] = await db.query(
        'DELETE FROM orders WHERE id = ?',
        [orderId]
      );
      return result;
    } catch (error) {
      console.error('Error deleting order:', error.message);
      throw error;
    }
  }
};

module.exports = orderModel;
