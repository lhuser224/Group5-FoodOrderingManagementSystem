const Shop = require('../models/Shop');

const shopService = {
  async getAll(filters = {}) {
    return await Shop.findAll(filters);
  },

  async getById(id) {
    const shop = await Shop.findById(id);
    if (!shop) {
      throw new Error('Shop not found');
    }
    return shop;
  },

  async create(shopData) {
    if (!shopData.shop_name) {
      throw new Error('Shop name is required');
    }

    return await Shop.create(shopData);
  },

  async update(id, updateData) {
    const shop = await Shop.findById(id);
    if (!shop) {
      throw new Error('Shop not found');
    }

    return await Shop.update(id, updateData);
  },

  async delete(id) {
    const shop = await Shop.findById(id);
    if (!shop) {
      throw new Error('Shop not found');
    }

    return await Shop.delete(id);
  }
};

module.exports = shopService;
