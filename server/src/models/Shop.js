const db = require('../config/db');

const Shop = {
  async findAll(filters = {}) {
    const isActiveFilter = filters.is_active !== undefined ? filters.is_active : true;
    let query = 'SELECT * FROM shops WHERE is_active = ?';
    const params = [isActiveFilter];

    if (filters.search) {
      query += ' AND shop_name LIKE ?';
      params.push(`%${filters.search}%`);
    }

    if (filters.user_id) {
      query += ' AND user_id = ?';
      params.push(filters.user_id);
    }

    const [rows] = await db.query(query, params);
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM shops WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(shopData) {
    const { 
      user_id, 
      shop_name, 
      shop_address, 
      image_url, 
      latitude, 
      longitude, 
      phone, 
      email 
    } = shopData;

    const [result] = await db.query(
      `INSERT INTO shops 
      (user_id, shop_name, shop_address, image_url, latitude, longitude, phone, email, is_active) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, shop_name, shop_address || '', image_url || '', latitude || null, longitude || null, phone || '', email || '', false]
    );
    return this.findById(result.insertId);
  },

  async update(id, updateData) {
    const fields = Object.keys(updateData).map(k => `${k} = ?`).join(', ');
    const values = [...Object.values(updateData), id];
    if (!fields) return this.findById(id);
    await db.query(`UPDATE shops SET ${fields} WHERE id = ?`, values);
    return this.findById(id);
  },

  async approve(id) {
    await db.query('UPDATE shops SET is_active = true WHERE id = ?', [id]);
    return this.findById(id);
  },

  async delete(id) {
    await db.query('DELETE FROM shops WHERE id = ?', [id]);
    return { id };
  }
};

module.exports = Shop;