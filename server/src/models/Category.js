const db = require('../config/db');

const Category = {
  async findAll() {
    const [rows] = await db.query(
      'SELECT * FROM categories WHERE status = "active"'
    );
    return rows;
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM categories WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async create(categoryData) {
    const { name, description } = categoryData;
    const [result] = await db.query(
      'INSERT INTO categories (name, description, status) VALUES (?, ?, ?)',
      [name, description || '', 'active']
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
    
    const query = `UPDATE categories SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(query, values);
    
    return this.findById(id);
  },

  async delete(id) {
    await db.query('UPDATE categories SET status = ? WHERE id = ?', ['inactive', id]);
    return { id };
  }
};

module.exports = Category;
