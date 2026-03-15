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
  }
};

module.exports = authService;
