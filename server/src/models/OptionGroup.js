// models/OptionGroup.js
const db = require('../config/db');

const OptionGroup = {
  async create(data) {
    const { shop_id, name, is_required, is_multiple, max_choices } = data;

    const [result] = await db.query(
      `INSERT INTO option_groups 
      (shop_id, name, is_required, is_multiple, max_choices)
      VALUES (?, ?, ?, ?, ?)`,
      [shop_id, name, is_required || false, is_multiple || true, max_choices || null]
    );

    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM option_groups WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findByShop(shopId) {
    const [rows] = await db.query(
      'SELECT * FROM option_groups WHERE shop_id = ?',
      [shopId]
    );
    return rows;
  }
};

module.exports = OptionGroup;