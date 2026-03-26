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
      res.status(500).json({ success: false, message: error.message });
    }
  },

  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await shopService.getById(parseInt(id));
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(error.message.includes('not found') ? 404 : 500).json({ success: false, message: error.message });
    }
  },

  async create(req, res) {
    try {
        const shopData = {
            ...req.body,
            user_id: req.user.id,
            image_url: req.file ? `/uploads/${req.file.filename}` : null
        };

        const newShop = await shopService.create(shopData);
        res.status(201).json({ success: true, data: newShop });
    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
},

  async approve(req, res) {
    try {
      const { id } = req.params;
      const result = await shopService.approve(parseInt(id));
      res.status(200).json({
        success: true,
        message: 'Shop approved and user promoted to seller',
        data: result
      });
    } catch (error) {
      res.status(error.message.includes('not found') ? 404 : 400).json({ success: false, message: error.message });
    }
  },

  async update(req, res) {
    try {
      const { id } = req.params;
      const result = await shopService.update(parseInt(id), req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(error.message.includes('not found') ? 404 : 400).json({ success: false, message: error.message });
    }
  },

  async delete(req, res) {
    try {
      const { id } = req.params;
      await shopService.delete(parseInt(id));
      res.status(200).json({ success: true, message: 'Shop deleted successfully' });
    } catch (error) {
      res.status(error.message.includes('not found') ? 404 : 500).json({ success: false, message: error.message });
    }
  }
};

module.exports = shopController;