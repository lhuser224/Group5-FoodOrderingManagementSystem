const foodService = require('../services/foodService');

const foodController = {
  async getAll(req, res) {
    try {
      const { shopId, categoryId, search } = req.query;

      const result = await foodService.getAll({
        shopId: shopId ? parseInt(shopId) : undefined,
        categoryId: categoryId ? parseInt(categoryId) : undefined,
        search
      });

      res.status(200).json({
        success: true,
        message: 'Foods retrieved successfully',
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

      const result = await foodService.getById(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Food retrieved successfully',
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
      const { name, price, image_url, shop_id, category_id } = req.body;

      const result = await foodService.create({
        name,
        price: parseFloat(price),
        image_url,
        shop_id: parseInt(shop_id),
        category_id: parseInt(category_id)
      });

      res.status(201).json({
        success: true,
        message: 'Food created successfully',
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

      if (updateData.price) {
        updateData.price = parseFloat(updateData.price);
      }

      const result = await foodService.update(parseInt(id), updateData);

      res.status(200).json({
        success: true,
        message: 'Food updated successfully',
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

      await foodService.delete(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Food deleted successfully',
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
  },

  async getByShop(req, res) {
    try {
      const { shopId } = req.params;

      const result = await foodService.getByShop(parseInt(shopId));

      res.status(200).json({
        success: true,
        message: 'Shop foods retrieved successfully',
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

  async getByCategory(req, res) {
    try {
      const { categoryId } = req.params;

      const result = await foodService.getByCategory(parseInt(categoryId));

      res.status(200).json({
        success: true,
        message: 'Category foods retrieved successfully',
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

  async toggleStatus(req, res) {
    try {
      const { id } = req.params;

      const result = await foodService.toggleStatus(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Food status updated successfully',
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
  }
};

module.exports = foodController;
