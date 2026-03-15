const db = require('../config/db');

const shopModel = {
  async getShopById(shopId) {
    try {
      const [shops] = await db.query(
        'SELECT * FROM shops WHERE id = ?',
        [shopId]
      );
      return shops.length > 0 ? shops[0] : null;
    } catch (error) {
      console.error('Error fetching shop by ID:', error.message);
      throw error;
    }
  },

  async getAllShops(filters = {}) {
    try {
      let query = 'SELECT * FROM shops WHERE 1=1';
      const params = [];

      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      if (filters.search) {
        query += ' AND shop_name LIKE ?';
        params.push(`%${filters.search}%`);
      }

      query += ' ORDER BY id DESC';

      const [shops] = await db.query(query, params);
      return shops;
    } catch (error) {
      console.error('Error fetching all shops:', error.message);
      throw error;
    }
  },

  async createShop(shopData) {
    try {
      const { shop_name, address, phone, email, status = 'active' } = shopData;

      if (!shop_name) {
        throw new Error('Shop name is required');
      }

      const [result] = await db.query(
        'INSERT INTO shops (shop_name, address, phone, email, status) VALUES (?, ?, ?, ?, ?)',
        [shop_name, address, phone, email, status]
      );

      return {
        id: result.insertId,
        shop_name,
        address,
        phone,
        email,
        status
      };
    } catch (error) {
      console.error('Error creating shop:', error.message);
      throw error;
    }
  },

  async updateShop(shopId, updateData) {
    try {
      const { shop_name, address, phone, email, status } = updateData;

      const [result] = await db.query(
        'UPDATE shops SET shop_name = ?, address = ?, phone = ?, email = ?, status = ? WHERE id = ?',
        [shop_name, address, phone, email, status, shopId]
      );

      return result;
    } catch (error) {
      console.error('Error updating shop:', error.message);
      throw error;
    }
  },

  async deleteShop(shopId) {
    try {
      const [result] = await db.query(
        'UPDATE shops SET status = ? WHERE id = ?',
        ['inactive', shopId]
      );
      return result;
    } catch (error) {
      console.error('Error deleting shop:', error.message);
      throw error;
    }
  },

  async getShopFoods(shopId) {
    try {
      const [foods] = await db.query(
        'SELECT * FROM foods WHERE shop_id = ? AND status = ? ORDER BY id DESC',
        [shopId, 'available']
      );
      return foods;
    } catch (error) {
      console.error('Error fetching shop foods:', error.message);
      throw error;
    }
  },

  async updateShopStatus(shopId, status) {
    try {
      const [result] = await db.query(
        'UPDATE shops SET status = ? WHERE id = ?',
        [status, shopId]
      );
      return result;
    } catch (error) {
      console.error('Error updating shop status:', error.message);
      throw error;
    }
  }
};

module.exports = shopModel;
