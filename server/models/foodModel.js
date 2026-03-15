const db = require('../config/db');

const foodModel = {
  async getFoodsByShopId(shopId) {
    try {
      const [foods] = await db.query(
        'SELECT * FROM foods WHERE shop_id = ? ORDER BY id DESC',
        [shopId]
      );
      return foods;
    } catch (error) {
      console.error('Error fetching foods by shop ID:', error.message);
      throw error;
    }
  },

  async getFoodById(foodId) {
    try {
      const [foods] = await db.query(
        'SELECT * FROM foods WHERE id = ?',
        [foodId]
      );
      return foods.length > 0 ? foods[0] : null;
    } catch (error) {
      console.error('Error fetching food by ID:', error.message);
      throw error;
    }
  },
 
  async getAllFoods(filters = {}) {
    try {
      let query = 'SELECT * FROM foods WHERE 1=1';
      const params = [];

      if (filters.categoryId) {
        query += ' AND category_id = ?';
        params.push(filters.categoryId);
      }

      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      if (filters.search) {
        query += ' AND name LIKE ?';
        params.push(`%${filters.search}%`);
      }

      query += ' ORDER BY id DESC';

      const [foods] = await db.query(query, params);
      return foods;
    } catch (error) {
      console.error('Error fetching all foods:', error.message);
      throw error;
    }
  },

  async createFood(foodData) {
    try {
      const { name, price, image_url, shop_id, category_id, status = 'available' } = foodData;

      if (!name || !price || !shop_id) {
        throw new Error('Name, price, and shop_id are required');
      }

      const [result] = await db.query(
        'INSERT INTO foods (name, price, image_url, shop_id, category_id, status) VALUES (?, ?, ?, ?, ?, ?)',
        [name, price, image_url, shop_id, category_id || null, status]
      );

      return {
        id: result.insertId,
        name,
        price,
        image_url,
        shop_id,
        category_id,
        status
      };
    } catch (error) {
      console.error('Error creating food:', error.message);
      throw error;
    }
  },

  async updateFood(foodId, updateData) {
    try {
      const { name, price, image_url, category_id, status } = updateData;

      const [result] = await db.query(
        'UPDATE foods SET name = ?, price = ?, image_url = ?, category_id = ?, status = ? WHERE id = ?',
        [name, price, image_url, category_id, status, foodId]
      );

      return result;
    } catch (error) {
      console.error('Error updating food:', error.message);
      throw error;
    }
  },

  async deleteFood(foodId) {
    try {
      const [result] = await db.query(
        'UPDATE foods SET status = ? WHERE id = ?',
        ['deleted', foodId]
      );
      return result;
    } catch (error) {
      console.error('Error deleting food:', error.message);
      throw error;
    }
  },

  async getFoodsByCategory(categoryId) {
    try {
      const [foods] = await db.query(
        'SELECT * FROM foods WHERE category_id = ? AND status = ? ORDER BY id DESC',
        [categoryId, 'available']
      );
      return foods;
    } catch (error) {
      console.error('Error fetching foods by category:', error.message);
      throw error;
    }
  },

  async updateFoodStatus(foodId, status) {
    try {
      const [result] = await db.query(
        'UPDATE foods SET status = ? WHERE id = ?',
        [status, foodId]
      );
      return result;
    } catch (error) {
      console.error('Error updating food status:', error.message);
      throw error;
    }
  },

  async searchFoods(searchTerm) {
    try {
      const [foods] = await db.query(
        'SELECT * FROM foods WHERE (name LIKE ? OR description LIKE ?) AND status = ? ORDER BY id DESC',
        [`%${searchTerm}%`, `%${searchTerm}%`, 'available']
      );
      return foods;
    } catch (error) {
      console.error('Error searching foods:', error.message);
      throw error;
    }
  }
};

module.exports = foodModel;