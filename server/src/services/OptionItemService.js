const OptionItem = require('../models/OptionItem');

const optionItemService = {
  async create(itemData) {
    if (!itemData.name || itemData.price === undefined) {
      throw new Error('Item name and price are required');
    }
    
    return await OptionItem.create({
      ...itemData,
      is_available: itemData.is_available ?? true
    });
  },

  async getByGroup(groupId) {
    return await OptionItem.findByGroup(groupId);
  },

  async toggleAvailability(id) {
    const item = await OptionItem.findById(id);
    if (!item) throw new Error('Option Item not found');
    
    return await OptionItem.update(id, { is_available: !item.is_available });
  }
};

module.exports = optionItemService;