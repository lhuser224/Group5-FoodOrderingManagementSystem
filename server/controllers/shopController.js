const shopModel = require('../models/shopModel');

const shopController = {
  async getShopById(req, res) {
    try {
      const { shopId } = req.params;

      if (!shopId) {
        return res.status(400).json({
          success: false,
          message: 'Shop ID is required'
        });
      }

      const shop = await shopModel.getShopById(shopId);

      if (!shop) {
        return res.status(404).json({
          success: false,
          message: 'Shop not found'
        });
      }

      res.status(200).json({
        success: true,
        data: shop
      });
    } catch (error) {
      console.error('Get shop error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching shop',
        error: error.message
      });
    }
  },

  async getAllShops(req, res) {
    try {
      const { status, search } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (search) filters.search = search;

      const shops = await shopModel.getAllShops(filters);

      res.status(200).json({
        success: true,
        data: shops,
        count: shops.length
      });
    } catch (error) {
      console.error('Get all shops error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching shops',
        error: error.message
      });
    }
  },

  async createShop(req, res) {
    try {
      const { shop_name, address, phone, email, status } = req.body;

      if (!shop_name) {
        return res.status(400).json({
          success: false,
          message: 'Shop name is required'
        });
      }

      const newShop = await shopModel.createShop({
        shop_name,
        address,
        phone,
        email,
        status
      });

      res.status(201).json({
        success: true,
        message: 'Shop created successfully',
        data: newShop
      });
    } catch (error) {
      console.error('Create shop error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error creating shop',
        error: error.message
      });
    }
  },

  async updateShop(req, res) {
    try {
      const { shopId } = req.params;
      const { shop_name, address, phone, email, status } = req.body;

      if (!shopId) {
        return res.status(400).json({
          success: false,
          message: 'Shop ID is required'
        });
      }

      if (!shop_name && !address && !phone && !email && !status) {
        return res.status(400).json({
          success: false,
          message: 'No data to update'
        });
      }

      const shop = await shopModel.getShopById(shopId);
      if (!shop) {
        return res.status(404).json({
          success: false,
          message: 'Shop not found'
        });
      }

      await shopModel.updateShop(shopId, {
        shop_name: shop_name || shop.shop_name,
        address: address || shop.address,
        phone: phone || shop.phone,
        email: email || shop.email,
        status: status || shop.status
      });

      const updatedShop = await shopModel.getShopById(shopId);

      res.status(200).json({
        success: true,
        message: 'Shop updated successfully',
        data: updatedShop
      });
    } catch (error) {
      console.error('Update shop error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error updating shop',
        error: error.message
      });
    }
  },

  async deleteShop(req, res) {
    try {
      const { shopId } = req.params;

      if (!shopId) {
        return res.status(400).json({
          success: false,
          message: 'Shop ID is required'
        });
      }

      const shop = await shopModel.getShopById(shopId);
      if (!shop) {
        return res.status(404).json({
          success: false,
          message: 'Shop not found'
        });
      }

      await shopModel.deleteShop(shopId);

      res.status(200).json({
        success: true,
        message: 'Shop deleted successfully',
        data: { id: shopId }
      });
    } catch (error) {
      console.error('Delete shop error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error deleting shop',
        error: error.message
      });
    }
  },

  async getShopFoods(req, res) {
    try {
      const { shopId } = req.params;

      if (!shopId) {
        return res.status(400).json({
          success: false,
          message: 'Shop ID is required'
        });
      }

      const shop = await shopModel.getShopById(shopId);
      if (!shop) {
        return res.status(404).json({
          success: false,
          message: 'Shop not found'
        });
      }

      const foods = await shopModel.getShopFoods(shopId);

      res.status(200).json({
        success: true,
        data: foods,
        count: foods.length
      });
    } catch (error) {
      console.error('Get shop foods error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching shop foods',
        error: error.message
      });
    }
  }
};

module.exports = shopController;
