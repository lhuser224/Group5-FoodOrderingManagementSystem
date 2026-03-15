const foodModel = require('../models/foodModel');

const foodController = {
  async getFoodsByShopId(req, res) {
    try {
      const { shopId } = req.params;

      if (!shopId) {
        return res.status(400).json({
          success: false,
          message: 'Shop ID is required'
        });
      }

      const foods = await foodModel.getFoodsByShopId(shopId);

      res.status(200).json({
        success: true,
        data: foods,
        count: foods.length
      });
    } catch (error) {
      console.error('Get foods by shop error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching foods',
        error: error.message
      });
    }
  },

  async getFoodById(req, res) {
    try {
      const { foodId } = req.params;

      if (!foodId) {
        return res.status(400).json({
          success: false,
          message: 'Food ID is required'
        });
      }

      const food = await foodModel.getFoodById(foodId);

      if (!food) {
        return res.status(404).json({
          success: false,
          message: 'Food not found'
        });
      }

      res.status(200).json({
        success: true,
        data: food
      });
    } catch (error) {
      console.error('Get food by ID error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching food',
        error: error.message
      });
    }
  },

  async getAllFoods(req, res) {
    try {
      const { categoryId, status, search } = req.query;

      const filters = {};
      if (categoryId) filters.categoryId = categoryId;
      if (status) filters.status = status;
      if (search) filters.search = search;

      const foods = await foodModel.getAllFoods(filters);

      res.status(200).json({
        success: true,
        data: foods,
        count: foods.length
      });
    } catch (error) {
      console.error('Get all foods error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching foods',
        error: error.message
      });
    }
  },

  async createFood(req, res) {
    try {
      const { name, price, image_url, shop_id, category_id, status } = req.body;

      // Validate required fields
      if (!name || !price || !shop_id) {
        return res.status(400).json({
          success: false,
          message: 'Name, price, and shop_id are required'
        });
      }

      // Validate price is a number
      if (isNaN(price) || Number(price) < 0) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid positive number'
        });
      }

      const newFood = await foodModel.createFood({
        name,
        price: Number(price),
        image_url,
        shop_id,
        category_id,
        status: status || 'available'
      });

      res.status(201).json({
        success: true,
        message: 'Food created successfully',
        data: newFood
      });
    } catch (error) {
      console.error('Create food error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error creating food',
        error: error.message
      });
    }
  },

  async updateFood(req, res) {
    try {
      const { foodId } = req.params;
      const { name, price, image_url, category_id, status } = req.body;

      if (!foodId) {
        return res.status(400).json({
          success: false,
          message: 'Food ID is required'
        });
      }

      if (!name && !price && !image_url && !category_id && !status) {
        return res.status(400).json({
          success: false,
          message: 'No data to update'
        });
      }

      // Validate price if provided
      if (price && (isNaN(price) || Number(price) < 0)) {
        return res.status(400).json({
          success: false,
          message: 'Price must be a valid positive number'
        });
      }

      // Check if food exists
      const food = await foodModel.getFoodById(foodId);
      if (!food) {
        return res.status(404).json({
          success: false,
          message: 'Food not found'
        });
      }

      await foodModel.updateFood(foodId, {
        name: name || food.name,
        price: price ? Number(price) : food.price,
        image_url: image_url || food.image_url,
        category_id: category_id || food.category_id,
        status: status || food.status
      });

      const updatedFood = await foodModel.getFoodById(foodId);

      res.status(200).json({
        success: true,
        message: 'Food updated successfully',
        data: updatedFood
      });
    } catch (error) {
      console.error('Update food error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error updating food',
        error: error.message
      });
    }
  },

  async deleteFood(req, res) {
    try {
      const { foodId } = req.params;

      if (!foodId) {
        return res.status(400).json({
          success: false,
          message: 'Food ID is required'
        });
      }

      // Check if food exists
      const food = await foodModel.getFoodById(foodId);
      if (!food) {
        return res.status(404).json({
          success: false,
          message: 'Food not found'
        });
      }

      await foodModel.deleteFood(foodId);

      res.status(200).json({
        success: true,
        message: 'Food deleted successfully',
        data: { id: foodId }
      });
    } catch (error) {
      console.error('Delete food error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error deleting food',
        error: error.message
      });
    }
  },

  async getFoodsByCategory(req, res) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: 'Category ID is required'
        });
      }

      const foods = await foodModel.getFoodsByCategory(categoryId);

      res.status(200).json({
        success: true,
        data: foods,
        count: foods.length
      });
    } catch (error) {
      console.error('Get foods by category error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching foods',
        error: error.message
      });
    }
  },

  async updateFoodStatus(req, res) {
    try {
      const { foodId } = req.params;
      const { status } = req.body;

      if (!foodId) {
        return res.status(400).json({
          success: false,
          message: 'Food ID is required'
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      // Validate status value
      const validStatuses = ['available', 'unavailable', 'deleted'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
        });
      }

      // Check if food exists
      const food = await foodModel.getFoodById(foodId);
      if (!food) {
        return res.status(404).json({
          success: false,
          message: 'Food not found'
        });
      }

      await foodModel.updateFoodStatus(foodId, status);
      const updatedFood = await foodModel.getFoodById(foodId);

      res.status(200).json({
        success: true,
        message: 'Food status updated successfully',
        data: updatedFood
      });
    } catch (error) {
      console.error('Update food status error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error updating food status',
        error: error.message
      });
    }
  },

  /**
   * Search foods by name
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async searchFoods(req, res) {
    try {
      const { term } = req.query;

      if (!term) {
        return res.status(400).json({
          success: false,
          message: 'Search term is required'
        });
      }

      const foods = await foodModel.searchFoods(term);

      res.status(200).json({
        success: true,
        data: foods,
        count: foods.length
      });
    } catch (error) {
      console.error('Search foods error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error searching foods',
        error: error.message
      });
    }
  }
};

module.exports = foodController;