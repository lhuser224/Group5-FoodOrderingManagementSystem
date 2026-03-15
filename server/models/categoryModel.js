const db = require('../config/db');

const categoryModel = {
  async getCategoryById(categoryId) {
    try {
      const [categories] = await db.query(
        'SELECT * FROM categories WHERE id = ?',
        [categoryId]
      );
      return categories.length > 0 ? categories[0] : null;
    } catch (error) {
      console.error('Error fetching category by ID:', error.message);
      throw error;
    }
  },

  async getAllCategories(filters = {}) {
    try {
      let query = 'SELECT * FROM categories WHERE 1=1';
      const params = [];

      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      query += ' ORDER BY id DESC';

      const [categories] = await db.query(query, params);
      return categories;
    } catch (error) {
      console.error('Error fetching all categories:', error.message);
      throw error;
    }
  },

  async createCategory(categoryData) {
    try {
      const { name, description, status = 'active' } = categoryData;

      if (!name) {
        throw new Error('Category name is required');
      }

      const [result] = await db.query(
        'INSERT INTO categories (name, description, status) VALUES (?, ?, ?)',
        [name, description, status]
      );

      return {
        id: result.insertId,
        name,
        description,
        status
      };
    } catch (error) {
      console.error('Error creating category:', error.message);
      throw error;
    }
  },

  async updateCategory(categoryId, updateData) {
    try {
      const { name, description, status } = updateData;

      const [result] = await db.query(
        'UPDATE categories SET name = ?, description = ?, status = ? WHERE id = ?',
        [name, description, status, categoryId]
      );

      return result;
    } catch (error) {
      console.error('Error updating category:', error.message);
      throw error;
    }
  },

  async deleteCategory(categoryId) {
    try {
      const [result] = await db.query(
        'UPDATE categories SET status = ? WHERE id = ?',
        ['inactive', categoryId]
      );
      return result;
    } catch (error) {
      console.error('Error deleting category:', error.message);
      throw error;
    }
  },

  async getCategoryFoods(categoryId) {
    try {
      const [foods] = await db.query(
        'SELECT * FROM foods WHERE category_id = ? AND status = ? ORDER BY id DESC',
        [categoryId, 'available']
      );
      return foods;
    } catch (error) {
      console.error('Error fetching category foods:', error.message);
      throw error;
    }
  }
};

module.exports = categoryModel;
