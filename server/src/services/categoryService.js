const Category = require('../models/Category');

const categoryService = {
  async getAll() {
    return await Category.findAll();
  },

  async getById(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }
    return category;
  },

  async create(categoryData) {
    if (!categoryData.name) {
      throw new Error('Category name is required');
    }

    return await Category.create(categoryData);
  },

  async update(id, updateData) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    return await Category.update(id, updateData);
  },

  async delete(id) {
    const category = await Category.findById(id);
    if (!category) {
      throw new Error('Category not found');
    }

    return await Category.delete(id);
  }
};

module.exports = categoryService;
