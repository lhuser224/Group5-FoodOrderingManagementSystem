const orderModel = require('../models/orderModel');
const cartModel = require('../models/cartModel');

const orderController = {
  async createOrder(req, res) {
    try {
      const userId = req.user.id;
      const { shop_id, total_price, items } = req.body;

      if (!shop_id || !items || items.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'shop_id and items are required'
        });
      }

      if (!total_price || total_price <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Valid total_price is required'
        });
      }

      const newOrder = await orderModel.createOrderWithItems({
        user_id: userId,
        shop_id,
        total_price,
        items
      });

      await cartModel.clearCart(userId);

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: newOrder
      });
    } catch (error) {
      console.error('Create order error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error creating order',
        error: error.message
      });
    }
  },

  async getOrderById(req, res) {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
      }

      const order = await orderModel.getOrderById(orderId);

      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      res.status(200).json({
        success: true,
        data: order
      });
    } catch (error) {
      console.error('Get order error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching order',
        error: error.message
      });
    }
  },

  async getUserOrders(req, res) {
    try {
      const userId = req.user.id;
      const { status } = req.query;

      const filters = {};
      if (status) filters.status = status;

      const orders = await orderModel.getOrdersByUserId(userId, filters);

      res.status(200).json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      console.error('Get user orders error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching user orders',
        error: error.message
      });
    }
  },

  async getShopOrders(req, res) {
    try {
      const { shopId } = req.params;
      const { status } = req.query;

      if (!shopId) {
        return res.status(400).json({
          success: false,
          message: 'Shop ID is required'
        });
      }

      const filters = {};
      if (status) filters.status = status;

      const orders = await orderModel.getOrdersByShopId(shopId, filters);

      res.status(200).json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      console.error('Get shop orders error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching shop orders',
        error: error.message
      });
    }
  },

  async getAllOrders(req, res) {
    try {
      const { status, shop_id } = req.query;

      const filters = {};
      if (status) filters.status = status;
      if (shop_id) filters.shop_id = shop_id;

      const orders = await orderModel.getAllOrders(filters);

      res.status(200).json({
        success: true,
        data: orders,
        count: orders.length
      });
    } catch (error) {
      console.error('Get all orders error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching orders',
        error: error.message
      });
    }
  },

  async updateOrderStatus(req, res) {
    try {
      const { orderId } = req.params;
      const { status } = req.body;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
      }

      if (!status) {
        return res.status(400).json({
          success: false,
          message: 'Status is required'
        });
      }

      const order = await orderModel.getOrderById(orderId);
      if (!order) {
        return res.status(404).json({
          success: false,
          message: 'Order not found'
        });
      }

      await orderModel.updateOrderStatus(orderId, status);

      const updatedOrder = await orderModel.getOrderById(orderId);

      res.status(200).json({
        success: true,
        message: 'Order status updated successfully',
        data: updatedOrder
      });
    } catch (error) {
      console.error('Update order status error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error updating order status',
        error: error.message
      });
    }
  },

  async cancelOrder(req, res) {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
      }

      await orderModel.cancelOrder(orderId);

      res.status(200).json({
        success: true,
        message: 'Order cancelled successfully',
        data: { id: orderId, status: 'cancelled' }
      });
    } catch (error) {
      console.error('Cancel order error:', error.message);
      res.status(500).json({
        success: false,
        message: error.message,
        error: error.message
      });
    }
  },

  async getOrderItems(req, res) {
    try {
      const { orderId } = req.params;

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: 'Order ID is required'
        });
      }

      const items = await orderModel.getOrderItems(orderId);

      res.status(200).json({
        success: true,
        data: items,
        count: items.length
      });
    } catch (error) {
      console.error('Get order items error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Error fetching order items',
        error: error.message
      });
    }
  }
};

module.exports = orderController;
