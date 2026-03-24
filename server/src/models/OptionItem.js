const db = require('../config/db');

const OptionItem = {
  async create(data) {
    const { group_id, name, price, is_available } = data;

    const [result] = await db.query(
      `INSERT INTO option_items 
      (group_id, name, price, is_available)
      VALUES (?, ?, ?, ?)`,
      [group_id, name, price || 0, is_available ?? true]
    );

    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM option_items WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findByGroup(groupId) {
    const [rows] = await db.query(
      'SELECT * FROM option_items WHERE group_id = ?',
      [groupId]
    );
    return rows;
  },

  async update(id, updateData) {
    const fields = [];
    const values = [];
    
    Object.keys(updateData).forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    });
    
    values.push(id);
    const query = `UPDATE option_items SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(query, values);
    return this.findById(id);
  }
};

module.exports = OptionItem;