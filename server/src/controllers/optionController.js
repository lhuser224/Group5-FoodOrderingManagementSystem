const optionGroupService = require('../services/OptionGroupService');
const optionItemService = require('../services/OptionItemService');
const foodOptionService = require('../services/FoodOptionService');

const optionController = {
  async createGroup(req, res) {
    try {
      const { name, is_required, is_multiple, max_choices, shop_id } = req.body;
      const result = await optionGroupService.create({
        shop_id, name, is_required, is_multiple, max_choices
      });
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async addItem(req, res) {
    try {
      const result = await optionItemService.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async assignToFood(req, res) {
    try {
      const { foodId, groupId } = req.body;
      await foodOptionService.assignGroup(foodId, groupId);
      res.status(200).json({ success: true, message: 'Gán tùy chọn thành công' });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async getFoodCustomization(req, res) {
    try {
      const { foodId } = req.params;
      const result = await foodOptionService.getFullCustomization(foodId);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = optionController;