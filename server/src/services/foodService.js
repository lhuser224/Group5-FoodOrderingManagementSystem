const Food = require('../models/Food');

const foodService = {
  async getAll(filters = {}) {
    return await Food.findAll(filters);
  },

  async getById(id) {
    const food = await Food.findById(id);
    if (!food) {
      throw new Error('Food not found');
    }
    return food;
  },

  async create(foodData) {
    if (!foodData.name || !foodData.price) {
      throw new Error('Name and price are required');
    }

    return await Food.create(foodData);
  },

  async update(id, updateData) {
    const food = await Food.findById(id);
    if (!food) {
      throw new Error('Food not found');
    }

    return await Food.update(id, updateData);
  },

  async delete(id) {
    const food = await Food.findById(id);
    if (!food) {
      throw new Error('Food not found');
    }

    return await Food.delete(id);
  },

  async getByShop(shopId) {
    return await Food.findByShop(shopId);
  },

  async getByCategory(categoryId) {
    return await Food.findByCategory(categoryId);
  },

  async toggleStatus(id) {
    const food = await Food.findById(id);
    if (!food) {
      throw new Error('Food not found');
    }

    const newStatus = food.status === 'available' ? 'unavailable' : 'available';
    return await Food.updateStatus(id, newStatus);
  }
};

module.exports = foodService;
