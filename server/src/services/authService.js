const User = require('../models/User');
const generateToken = require('../utils/generateToken');

const authService = {
  async register(userData) {
    const { phone, password, full_name, role } = userData;

    const existingUser = await User.findByPhone(phone);
    if (existingUser) {
      throw new Error('Phone number already registered');
    }

    const newUser = await User.create({
      phone,
      password,
      full_name: full_name || '',
      role: role || 'customer'
    });

    const token = generateToken(newUser);

    return {
      user: {
        id: newUser.id,
        phone: newUser.phone,
        full_name: newUser.full_name,
        role: newUser.role
      },
      token
    };
  },

  async login(phone, password) {
    const user = await User.findByPhone(phone);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await User.verifyPassword(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    if (user.status !== 'active') {
      throw new Error('User account is inactive');
    }

    const token = generateToken({
      id: user.id,
      role: user.role
    });

    return {
      user: {
        id: user.id,
        phone: user.phone,
        full_name: user.full_name,
        role: user.role
      },
      token
    };
  },

  async updateProfile(userId, updateData) {
    const allowedFields = ['full_name', 'phone'];
    const filteredData = {};
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredData[field] = updateData[field];
      }
    });

    if (Object.keys(filteredData).length === 0) return await userModel.findById(userId);

    return await userModel.update(userId, filteredData);
  },

  async changePassword(userId, oldPassword, newPassword) {
    const user = await userModel.findById(userId);
    if (!user) throw new Error('Người dùng không tồn tại');

    const isMatch = await bcrypt.compare(oldPassword, user.password);
    
    if (!isMatch) throw new Error('Mật khẩu cũ không chính xác');

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    
    return await userModel.update(userId, { password: hashedNewPassword });
  }
};

module.exports = authService;
