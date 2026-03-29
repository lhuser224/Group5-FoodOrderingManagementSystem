const db = require('../config/db');

const Shop = {
  async findAll(filters = {}) {
    let query = 'SELECT * FROM shops WHERE 1=1';
    const params = [];

    if (filters.is_active !== undefined) {
      query += ' AND is_active = ?';
      params.push(filters.is_active);
    }

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
    async getByUserId(userId) {
    const [rows] = await db.query('SELECT * FROM shops WHERE user_id = ?', [userId]);
    return rows[0];
  },

  async toggleOpenStatus(shopId) {
    // Đảo ngược giá trị is_open hiện tại
    const [result] = await db.query(
        'UPDATE shops SET is_open = NOT is_open WHERE id = ?', 
        [shopId]
    );
    return result;
  },

  async findById(id) {
    const [rows] = await db.query('SELECT * FROM shops WHERE id = ?', [id]);
    return rows[0] || null;
  },

  async create(shopData) {
    const { 
      user_id, shop_name, province, district, ward, 
      shop_address, image_url 
    } = shopData;

    const [result] = await db.query(
      `INSERT INTO shops 
      (user_id, shop_name, province, district, ward, shop_address, image_url, is_active, is_open) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [user_id, shop_name, province, district, ward, shop_address, image_url || '', false, true]
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