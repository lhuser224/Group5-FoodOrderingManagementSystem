const orderService = require('../services/orderService');

const orderController = {
  async create(req, res) {
    try {
      const userId = req.user.id;
      const { shop_id, items } = req.body;

      if (!shop_id || !items) {
        return res.status(400).json({
          success: false,
          message: 'Shop ID and items are required',
          data: null
        });
      }

      const result = await orderService.create(userId, {
        shop_id: parseInt(shop_id),
        items
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
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

  async getById(req, res) {
    try {
      const { id } = req.params;

      const result = await orderService.getById(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Order retrieved successfully',
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

  async getByUserId(req, res) {
    try {
      const userId = req.user.id;
      const { status } = req.query;

      const result = await orderService.getByUserId(userId, {
        status
      });

      res.status(200).json({
        success: true,
        message: 'Orders retrieved successfully',
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

  async getByShopId(req, res) {
    try {
      const { shopId } = req.params;
      const { status } = req.query;

      const result = await orderService.getByShopId(parseInt(shopId), {
        status
      });

      res.status(200).json({
        success: true,
        message: 'Shop orders retrieved successfully',
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

  async updateStatus(req, res) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required',
          data: null
        });
      }

      const result = await orderService.updateStatus(parseInt(id), status);

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
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

  async cancel(req, res) {
    try {
      const { id } = req.params;

      const result = await orderService.cancel(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
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
  }
};

module.exports = orderController;
