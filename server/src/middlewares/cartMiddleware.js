const cartMiddleware = {
  validateAddItem: (req, res, next) => {
    const { food_id, quantity } = req.body;
    if (!food_id || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: 'Food ID and quantity are required',
        data: null
      });
    }
    const qty = parseInt(quantity);
    if (isNaN(qty) || qty <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Quantity must be a number greater than 0',
        data: null
      });
    }
    req.body.quantity = qty;
    req.body.food_id = parseInt(food_id);
    
    next();
  },

  validateUpdateItem: (req, res, next) => {
    const { quantity } = req.body;

    if (quantity !== undefined) {
      const qty = parseInt(quantity);
      if (isNaN(qty) || qty <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Quantity must be a number greater than 0',
          data: null
        });
      }
      req.body.quantity = qty;
    }

    next();
  }
};

module.exports = cartMiddleware;