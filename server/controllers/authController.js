const userModel = require('../models/userModel');
const { generateToken } = require('../middleware/auth');

const authController = {
  /**
   * Login user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async login(req, res) {
    try {
      const { phone, password } = req.body;

      // Validate input
      if (!phone || !password) {
        return res.status(400).json({
          success: false,
          message: 'Phone and password are required'
        });
      }

      // Get user from database
      const user = await userModel.getUserByPhone(phone);
      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid phone or password'
        });
      }

      // Verify password
      const isPasswordValid = await userModel.verifyPassword(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({
          success: false,
          message: 'Invalid phone or password'
        });
      }

      // Check user status
      if (user.status !== 'active') {
        return res.status(403).json({
          success: false,
          message: 'User account is inactive'
        });
      }

      // Generate JWT token
      const token = generateToken(user.id, user.role);

      // Return success response
      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: {
          user_id: user.id,
          phone: user.phone,
          full_name: user.full_name,
          role: user.role,
          token
        }
      });
    } catch (error) {
      console.error('Login error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Server error during login',
        error: error.message
      });
    }
  },

  /**
   * Register new user
   * @param {Object} req - Express request
   * @param {Object} res - Express response
   */
  async register(req, res) {
    try {
      const { phone, password, full_name, role = 'customer' } = req.body;

      // Validate input
      if (!phone || !password || !full_name) {
        return res.status(400).json({
          success: false,
          message: 'Phone, password, and full_name are required'
        });
      }

      // Check if user already exists
      const existingUser = await userModel.getUserByPhone(phone);
      if (existingUser) {
        return res.status(409).json({
          success: false,
          message: 'Phone number already exists'
        });
      }

      // Create new user
      const newUser = await userModel.createUser({
        phone,
        password,
        full_name,
        role,
        status: 'active'
      });

      // Generate JWT token
      const token = generateToken(newUser.id, newUser.role);

      // Return success response
      res.status(201).json({
        success: true,
        message: 'Registration successful',
        data: {
          user_id: newUser.id,
          phone: newUser.phone,
          full_name: newUser.full_name,
          role: newUser.role,
          token
        }
      });
    } catch (error) {
      console.error('Register error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Server error during registration',
        error: error.message
      });
    }
  },

  /**
   * Get current user profile
   * @param {Object} req - Express request (requires auth)
   * @param {Object} res - Express response
   */
  async getProfile(req, res) {
    try {
      const userId = req.user.id;

      const user = await userModel.getUserById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.status(200).json({
        success: true,
        data: user
      });
    } catch (error) {
      console.error('Get profile error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Server error fetching profile',
        error: error.message
      });
    }
  },

  /**
   * Update user profile
   * @param {Object} req - Express request (requires auth)
   * @param {Object} res - Express response
   */
  async updateProfile(req, res) {
    try {
      const userId = req.user.id;
      const { full_name, status } = req.body;

      if (!full_name && !status) {
        return res.status(400).json({
          success: false,
          message: 'No data to update'
        });
      }

      await userModel.updateUser(userId, {
        full_name: full_name || null,
        status: status || null
      });

      const updatedUser = await userModel.getUserById(userId);

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: updatedUser
      });
    } catch (error) {
      console.error('Update profile error:', error.message);
      res.status(500).json({
        success: false,
        message: 'Server error updating profile',
        error: error.message
      });
    }
  }
};

module.exports = authController;
