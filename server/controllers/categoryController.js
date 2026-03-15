const categoryModel = require('../models/categoryModel');

const categoryController = {
  async getCategoryById(req, res) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: 'Category ID is required'
        });
      }

      const category = await categoryModel.getCategoryById(categoryId);

      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      res.status(200).json({
        success: true,
        data: category
      });
    } catch (error) {
      console.error('Get category error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching category',
        error: error.message
      });
    }
  },

  async getAllCategories(req, res) {
    try {
      const { status } = req.query;

      const filters = {};
      if (status) filters.status = status;

      const categories = await categoryModel.getAllCategories(filters);

      res.status(200).json({
        success: true,
        data: categories,
        count: categories.length
      });
    } catch (error) {
      console.error('Get all categories error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching categories',
        error: error.message
      });
    }
  },

  async createCategory(req, res) {
    try {
      const { name, description, status } = req.body;

      if (!name) {
        return res.status(400).json({
          success: false,
          message: 'Category name is required'
        });
      }

      const newCategory = await categoryModel.createCategory({
        name,
        description,
        status
      });

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: newCategory
      });
    } catch (error) {
      console.error('Create category error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error creating category',
        error: error.message
      });
    }
  },

  async updateCategory(req, res) {
    try {
      const { categoryId } = req.params;
      const { name, description, status } = req.body;

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: 'Category ID is required'
        });
      }

      if (!name && !description && !status) {
        return res.status(400).json({
          success: false,
          message: 'No data to update'
        });
      }

      const category = await categoryModel.getCategoryById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      await categoryModel.updateCategory(categoryId, {
        name: name || category.name,
        description: description || category.description,
        status: status || category.status
      });

      const updatedCategory = await categoryModel.getCategoryById(categoryId);

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: updatedCategory
      });
    } catch (error) {
      console.error('Update category error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error updating category',
        error: error.message
      });
    }
  },

  async deleteCategory(req, res) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: 'Category ID is required'
        });
      }

      const category = await categoryModel.getCategoryById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      await categoryModel.deleteCategory(categoryId);

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
        data: { id: categoryId }
      });
    } catch (error) {
      console.error('Delete category error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error deleting category',
        error: error.message
      });
    }
  },

  async getCategoryFoods(req, res) {
    try {
      const { categoryId } = req.params;

      if (!categoryId) {
        return res.status(400).json({
          success: false,
          message: 'Category ID is required'
        });
      }

      const category = await categoryModel.getCategoryById(categoryId);
      if (!category) {
        return res.status(404).json({
          success: false,
          message: 'Category not found'
        });
      }

      const foods = await categoryModel.getCategoryFoods(categoryId);

      res.status(200).json({
        success: true,
        data: foods,
        count: foods.length
      });
    } catch (error) {
      console.error('Get category foods error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching category foods',
        error: error.message
      });
    }
  }
};

module.exports = categoryController;
