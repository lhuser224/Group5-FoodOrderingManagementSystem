const OptionGroup = require('../models/OptionGroup');

const optionGroupService = {
  async create(groupData) {
    if (!groupData.name || !groupData.shop_id) {
      throw new Error('Name and Shop ID are required');
    }
    return await OptionGroup.create(groupData);
  },

  async getByShop(shopId) {
    return await OptionGroup.findByShop(shopId);
  },

  async getById(id) {
    const group = await OptionGroup.findById(id);
    if (!group) throw new Error('Option Group not found');
    return group;
  }
};

module.exports = optionGroupService;