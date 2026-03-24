const db = require('../config/db');
const bcrypt = require('bcrypt');

const User = {
  async create(userData) {
    const { full_name, phone, password, role = 'customer' } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const [result] = await db.query(
      'INSERT INTO users (phone, password, full_name, role, status) VALUES (?, ?, ?, ?, ?)',
      [phone, hashedPassword, full_name, role, 'active']
    );
    
    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT id, phone, full_name, role, status FROM users WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findByPhone(phone) {
    const [rows] = await db.query(
      'SELECT id, phone, password, full_name, role, status FROM users WHERE phone = ?',
      [phone]
    );
    return rows[0] || null;
  },

  async verifyPassword(password, hashedPassword) {
    return bcrypt.compare(password, hashedPassword);
  },

  async update(id, updateData) {
    const keys = Object.keys(updateData);
    if (keys.length === 0) return this.findById(id); 

    const fields = [];
    const values = [];
    
    keys.forEach(key => {
      fields.push(`${key} = ?`);
      values.push(updateData[key]);
    });
    
    values.push(id);
    const query = `UPDATE users SET ${fields.join(', ')} WHERE id = ?`;
    await db.query(query, values);
    
    return this.findById(id);
  }
};

module.exports = User;
