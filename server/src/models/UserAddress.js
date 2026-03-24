const db = require('../config/db');

const UserAddress = {
    async create(data) {
    const { user_id, receiver_name, receiver_phone, address_detail, latitude, longitude, is_default } = data;
    const existingAddresses = await this.findByUser(user_id);    
    let finalIsDefault = false;

    if (existingAddresses.length === 0) {
      finalIsDefault = true;
    } else {
      finalIsDefault = is_default || false;
      if (finalIsDefault) {
        await db.query(
          'UPDATE user_addresses SET is_default = false WHERE user_id = ?',
          [user_id]
        );
      }
    }
    const [result] = await db.query(
      `INSERT INTO user_addresses 
      (user_id, receiver_name, receiver_phone, address_detail, latitude, longitude, is_default)
      VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, receiver_name, receiver_phone, address_detail, latitude, longitude, finalIsDefault]
    );

    return this.findById(result.insertId);
  },

  async findById(id) {
    const [rows] = await db.query(
      'SELECT * FROM user_addresses WHERE id = ?',
      [id]
    );
    return rows[0] || null;
  },

  async findByUser(userId) {
    const [rows] = await db.query(
      'SELECT * FROM user_addresses WHERE user_id = ?',
      [userId]
    );
    return rows;
  },

  async delete(id) {
    const address = await this.findById(id);
    if (!address) return { success: false, message: "Địa chỉ không tồn tại" };
    if (address.is_default) {
      return { 
        success: false, 
        message: "Không thể xóa địa chỉ mặc định. Vui lòng chọn địa chỉ khác làm mặc định trước khi xóa." 
      };
    }
    await db.query('DELETE FROM user_addresses WHERE id = ?', [id]);
    return { success: true, message: "Xóa địa chỉ thành công" };
  },
  async updateDefault(userId, addressId) {
    await db.query(
      'UPDATE user_addresses SET is_default = false WHERE user_id = ?',
      [userId]
    );
    await db.query(
      'UPDATE user_addresses SET is_default = true WHERE id = ? AND user_id = ?',
      [addressId, userId]
    );
    return this.findById(addressId);
  },
};

module.exports = UserAddress;