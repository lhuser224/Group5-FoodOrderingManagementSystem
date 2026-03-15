const db = require('../config/db');
const bcrypt = require('bcrypt');

const userModel = {
  async init() {
    try {
      const [users] = await db.query(
        'SELECT * FROM users WHERE phone = ?',
        ['0123456789']
      );

      if (users.length === 0) {
        const hashedPassword = await bcrypt.hash('123', 10);
        await db.query(
          'INSERT INTO users (phone, password, full_name, role, status) VALUES (?, ?, ?, ?, ?)',
          ['0123456789', hashedPassword, 'Test User', 'customer', 'active']
        );
        console.log('✓ Test user created: phone=0123456789, password=123');
      } else {
        console.log('✓ Test user already exists');
      }
    } catch (error) {
      console.error('Error initializing test user:', error.message);
      throw error;
    }
  },

  async getUserById(userId) {
    try {
      const [users] = await db.query(
        'SELECT id, phone, full_name, role, status, created_at FROM users WHERE id = ?',
        [userId]
      );
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error fetching user by ID:', error.message);
      throw error;
    }
  },

  async getUserByPhone(phone) {
    try {
      const [users] = await db.query(
        'SELECT * FROM users WHERE phone = ?',
        [phone]
      );
      return users.length > 0 ? users[0] : null;
    } catch (error) {
      console.error('Error fetching user by phone:', error.message);
      throw error;
    }
  },

  async createUser(userData) {
    try {
      const { phone, password, full_name, role = 'customer', status = 'active' } = userData;

      if (!phone || !password || !full_name) {
        throw new Error('Phone, password, and full_name are required');
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const [result] = await db.query(
        'INSERT INTO users (phone, password, full_name, role, status) VALUES (?, ?, ?, ?, ?)',
        [phone, hashedPassword, full_name, role, status]
      );

      return {
        id: result.insertId,
        phone,
        full_name,
        role,
        status
      };
    } catch (error) {
      console.error('Error creating user:', error.message);
      throw error;
    }
  },

  async verifyPassword(password, hashedPassword) {
    try {
      return await bcrypt.compare(password, hashedPassword);
    } catch (error) {
      console.error('Error verifying password:', error.message);
      throw error;
    }
  },

  async updateUser(userId, updateData) {
    try {
      const { full_name, status } = updateData;
      const [result] = await db.query(
        'UPDATE users SET full_name = ?, status = ? WHERE id = ?',
        [full_name, status, userId]
      );
      return result;
    } catch (error) {
      console.error('Error updating user:', error.message);
      throw error;
    }
  },

  async deleteUser(userId) {
    try {
      const [result] = await db.query(
        'UPDATE users SET status = ? WHERE id = ?',
        ['inactive', userId]
      );
      return result;
    } catch (error) {
      console.error('Error deleting user:', error.message);
      throw error;
    }
  },

  async getAllUsers(filters = {}) {
    try {
      let query = 'SELECT id, phone, full_name, role, status, created_at FROM users WHERE 1=1';
      const params = [];

      if (filters.role) {
        query += ' AND role = ?';
        params.push(filters.role);
      }

      if (filters.status) {
        query += ' AND status = ?';
        params.push(filters.status);
      }

      const [users] = await db.query(query, params);
      return users;
    } catch (error) {
      console.error('Error fetching all users:', error.message);
      throw error;
    }
  }
};

module.exports = userModel;
