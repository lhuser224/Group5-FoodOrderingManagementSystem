const Order = require('../models/Order');
const Food = require('../models/Food');
const Cart = require('../models/Cart');

const orderService = {
  async create(userId, orderData) {
    const { shop_id, items } = orderData;

    if (!items || items.length === 0) {
      throw new Error('Order must contain at least one item');
    }

    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const food = await Food.findById(item.food_id);
      if (!food) {
        throw new Error(`Food with id ${item.food_id} not found`);
      }

      const itemTotal = item.quantity * food.price;
      totalPrice += itemTotal;

      validatedItems.push({
        food_id: item.food_id,
        quantity: item.quantity,
        price: food.price,
        base_price: food.price,
        total_price: itemTotal,
        selected_options: item.selected_options || {}
      });
    }

    const order = await Order.create({
      user_id: userId,
      shop_id,
      total_price: totalPrice,
      items: validatedItems
    });

    await Cart.clearCart(userId);

    return order;
  },

  async getById(id) {
    const order = await Order.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    const items = await Order.getItems(id);
    return {
      ...order,
      items
    };
  },

  async getByUserId(userId, filters = {}) {
    const orders = await Order.findByUserId(userId, filters);
    const ordersWithItems = [];

    for (const order of orders) {
      const items = await Order.getItems(order.id);
      ordersWithItems.push({
        ...order,
        items
      });
    }

    return ordersWithItems;
  },

  async getByShopId(shopId, filters = {}) {
    const orders = await Order.findByShopId(shopId, filters);
    const ordersWithItems = [];

    for (const order of orders) {
      const items = await Order.getItems(order.id);
      ordersWithItems.push({
        ...order,
        items
      });
    }

    return ordersWithItems;
  },

  async updateStatus(id, status) {
    const validStatuses = ['pending', 'accepted', 'preparing', 'ready', 'completed', 'cancelled'];
    if (!validStatuses.includes(status)) {
      throw new Error(`Invalid status. Must be one of: ${validStatuses.join(', ')}`);
    }

    const order = await Order.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    return await Order.updateStatus(id, status);
  },

  async cancel(id) {
    const order = await Order.findById(id);
    if (!order) {
      throw new Error('Order not found');
    }

    return await Order.cancel(id);
  }
};

module.exports = orderService;
