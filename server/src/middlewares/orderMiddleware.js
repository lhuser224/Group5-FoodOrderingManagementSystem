const orderMiddleware = {
  validateCreateOrder: (req, res, next) => {
    const { shop_id, items } = req.body;
    if (!shop_id || !items) {
      return res.status(400).json({
        success: false,
        message: 'Shop ID and items are required',
        data: null
      });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Order must contain at least one item in an array',
        data: null
      });
    }
    for (const item of items) {
      if (!item.food_id || !item.quantity || item.quantity <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Each item must have a valid food_id and a quantity greater than 0',
          data: null
        });
      }
    }
    next();
  },
  validateUpdateStatus: (req, res, next) => {
    const { status } = req.body;
    const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required',
        data: null
      });
    }
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
        data: null
      });
    }
    next();
  }
};

module.exports = orderMiddleware;