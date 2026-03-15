const db = require('../config/db');

const Food = {
  async findAll(filters = {}) {
    let query = 'SELECT * FROM foods WHERE status = "available"';
    const params = [];
    
    if (filters.shopId) {
      query += ' AND shop_id = ?';
      params.push(filters.shopId);
    }
    
    if (filters.categoryId) {
      query += ' AND category_id = ?';
      params.push(filters.categoryId);
    }
    
    if (filters.search) {
      query += ' AND name LIKE ?';
      params.push(`%${filters.search}%`);
    }
    
    const [rows] = await db.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM foods WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create(foodData) {
    const { name, price, image_url, shop_id, category_id } = foodData;
    const [result] = await db.query(
      'INSERT INTO foods (name, price, image_url, shop_id, category_id, status) VALUES (?, ?, ?, ?, ?, ?)',
      [name, price, image_url || '', shop_id, category_id, 'available']
    );
    return this.findById(result.insertId);
  },

  async update(id, updateData) {
    const fields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    });
    
    values.push(id);
    
    const query = `UPDATE foods SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(query, values);
    
    return this.findById(id);
  },

  async delete(id) {
    await db.query('UPDATE foods SET status = ? WHERE id = ?', ['deleted', id]);
    return { id };
  },

  async findByShop(shopId) {
    const [rows] = await db.query(
      'SELECT * FROM foods WHERE shop_id = ? AND status = "available"',
      [shopId]
    );
    return rows;
  },

  async findByCategory(categoryId) {
    const [rows] = await db.query(
      'SELECT * FROM foods WHERE category_id = ? AND status = "available"',
      [categoryId]
    );
    return rows;
  },

  async updateStatus(id, status) {
    await db.query('UPDATE foods SET status = ? WHERE id = ?', [status, id]);
    return this.findById(id);
  }
};

module.exports = Food;
