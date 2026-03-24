const FoodOption = require('../models/FoodOption');
const Food = require('../models/Food');

const foodOptionService = {
  async assignGroup(foodId, groupId) {
    const food = await Food.findById(foodId);
    if (!food) throw new Error('Food not found');    
    return await FoodOption.assignGroupToFood(foodId, groupId);
  },

  async getFullCustomization(foodId) {
    const food = await Food.findById(foodId);
    if (!food) throw new Error('Food not found');
    return await FoodOption.getGroupsWithItems(foodId);
  }
};

module.exports = foodOptionService;