const authService = require('../services/authService');

const authController = {
  async register(req, res) {
    try {
      const { phone, password, full_name, role } = req.body;

      if (!phone || !password) {
        return res.status(400).json({
          success: false,
          message: 'Phone and password are required',
          data: null
        });
      }

      const result = await authService.register({
        phone,
        password,
        full_name: full_name || '',
        role: role || 'customer'
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: result
      });
    } catch (error) {
      if (error.message.includes('already registered')) {
        return res.status(409).json({
          success: false,
          message: error.message,
          data: null
        });
      }

      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  async login(req, res) {
    try {
      const { phone, password } = req.body;

      if (!phone || !password) {
        return res.status(400).json({
          success: false,
          message: 'Phone and password are required',
          data: null
        });
      }

      const result = await authService.login(phone, password);

      res.status(200).json({
        success: true,
        message: 'Login successful',
        data: result
      });
    } catch (error) {
      if (error.message.includes('Invalid credentials')) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials',
          data: null
        });
      }

      res.status(500).json({
        success: false,
        message: error.message,
        data: null
      });
    }
  },

  async getByUserId(req, res) {
    try {
      const userId = req.user.id;
      const result = await orderService.getByUserId(userId); 

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },
  
  async handleUpdateProfile(req, res) {
    try {
      const result = await authService.updateProfile(req.user.id, req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  async handleChangePassword(req, res) {
    try {
      const { oldPassword, newPassword } = req.body;
      await authService.changePassword(req.user.id, oldPassword, newPassword);
      res.status(200).json({ success: true, message: "Đổi mật khẩu thành công!" });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
};

module.exports = authController;
