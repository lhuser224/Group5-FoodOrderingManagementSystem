const shopService = require('../services/shopService');

const shopController = {
  async getAll(req, res) {
    try {
      const { search, is_active } = req.query;
      const filterActive = is_active === 'false' ? false : (is_active === 'true' ? true : undefined);

      const result = await shopService.getAll({ 
        search, 
        is_active: filterActive 
      });

      res.status(200).json({
        success: true,
        message: 'Shops retrieved successfully',
        data: result
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await shopService.getById(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Shop retrieved successfully',
        data: result
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message,
          data: null
        });
      }
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  async create(req, res) {
    try {
      const result = await shopService.create(req.user.id, req.body);

      res.status(201).json({
        success: true,
        message: 'Shop created successfully',
        data: result
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  async approve(req, res) {
    try {
      const { id } = req.params;
      const result = await shopService.approve(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Shop approved successfully',
        data: result
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message,
          data: null
        });
      }
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await shopService.update(parseInt(id), req.body);

      res.status(200).json({
        success: true,
        message: 'Shop updated successfully',
        data: result
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message,
          data: null
        });
      }
      res.status(400).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await shopService.delete(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Shop deleted successfully',
        data: null
      });
    } catch (error) {
      if (error.message.includes('not found')) {
        return res.status(404).json({
          success: false,
          message: error.message,
          data: null
        });
      }
      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  }
};

module.exports = shopController;