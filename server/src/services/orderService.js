const Order = require('../models/Order');
const Food = require('../models/Food');
const Cart = require('../models/Cart');

const orderService = {
  async create(userId, orderData) {
    const { shop_id, items } = orderData;
    let totalPrice = 0;
    const validatedItems = [];

    for (const item of items) {
      const food = await Food.findById(item.food_id);
      if (!food) throw new Error(`Food with id ${item.food_id} not found`);
      if (food.shop_id !== shop_id) {
        throw new Error(`Food ${food.name} does not belong to this shop`);
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

  async getByUserId(userId, filters = {}) {
    const orders = await Order.findByUserId(userId, filters);
    const enriched = [];
    for (const order of orders) {
      const items = await Order.getItems(order.id);
      enriched.push({ ...order, items });
    }
    return enriched;
  },

  async getByShopId(shopId, filters = {}) {
    const orders = await Order.findByShopId(shopId, filters);
    const enriched = [];
    for (const order of orders) {
      const items = await Order.getItems(order.id);
      enriched.push({ ...order, items });
    }
    return enriched;
  },

  async getById(id) {
    const order = await Order.findById(id);
    if (!order) throw new Error('Order not found');
    const items = await Order.getItems(id);
    return { ...order, items };
  },

  async updateStatus(id, status) {
    const order = await Order.findById(id);
    if (!order) throw new Error('Order not found');
    if (order.status === 'completed' || order.status === 'cancelled') {
      throw new Error(`Cannot update status of a ${order.status} order`);
    }
    return await Order.updateStatus(id, status);
  },

  async cancel(id) {
    const order = await Order.findById(id);
    if (!order) throw new Error('Order not found');
    if (order.status !== 'pending') {
      throw new Error('Only pending orders can be cancelled');
    }
    return await Order.cancel(id);
  }
};

module.exports = orderService;