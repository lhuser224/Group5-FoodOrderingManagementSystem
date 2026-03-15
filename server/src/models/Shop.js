const db = require('../config/db');

const Shop = {
  async findAll(filters = {}) {
    let query = 'SELECT * FROM shops WHERE status = "active"';
    const params = [];

    if (filters.search) {
      query += ' AND shop_name LIKE ?';
      params.push(`%${filters.search}%`);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM shops WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create(shopData) {
    const { shop_name, address, phone, email } = shopData;
    const [result] = await db.query(
      'INSERT INTO shops (shop_name, address, phone, email, status) VALUES (?, ?, ?, ?, ?)',
      [shop_name, address || '', phone || '', email || '', 'active']
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
    
    const query = `UPDATE shops SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(query, values);
    
    return this.findById(id);
  },

  async delete(id) {
    await db.query('UPDATE shops SET status = ? WHERE id = ?', ['inactive', id]);
    return { id };
  }
};

module.exports = Shop;
