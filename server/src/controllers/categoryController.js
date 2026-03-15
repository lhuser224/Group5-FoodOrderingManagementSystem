const categoryService = require('../services/categoryService');

const categoryController = {
  async getAll(req, res) {
    try {
      const result = await categoryService.getAll();

      res.status(200).json({
        success: true,
        message: 'Categories retrieved successfully',
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

      const result = await categoryService.getById(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Category retrieved successfully',
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
      const { name, description } = req.body;

      const result = await categoryService.create({
        name,
        description
      });

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
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

      const result = await categoryService.update(parseInt(id), updateData);

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
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

      await categoryService.delete(parseInt(id));

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
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

module.exports = categoryController;
