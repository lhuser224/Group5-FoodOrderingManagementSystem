const shopService = require('../services/shopService');

const shopController = {
  async getAll(req, res) {
    try {
      const { search } = req.query;

      const result = await shopService.getAll({ search });

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
      const { shop_name, address, phone, email } = req.body;

      const result = await shopService.create({
        shop_name,
        address,
        phone,
        email
      });

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

  async update(req, res) {
    try {
      const { id } = req.params;
      const updateData = req.body;

      const result = await shopService.update(parseInt(id), updateData);

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
