const shopService = require('../services/shopService');

const shopController = {
  // Lấy tất cả shop (Có filter tìm kiếm và trạng thái active)
  async getAll(req, res) {
    try {
      const { search, is_active } = req.query;
      // Chuyển string query sang boolean
      const filterActive = is_active === 'false' ? false : (is_active === 'true' ? true : undefined);

      const result = await shopService.getAll({ 
        search, 
        is_active: filterActive 
      });

      res.status(200).json({
        success: true,
        data: result
      });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Lấy chi tiết 1 shop theo ID
  async getById(req, res) {
    try {
      const { id } = req.params;
      const result = await shopService.getById(parseInt(id));
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      const statusCode = error.message.includes('không tồn tại') ? 404 : 500;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  },

  // Lấy shop của chính người đang đăng nhập (Dashboard Seller)
  async getMyShop(req, res) {
    try {
      const shop = await shopService.getByUserId(req.user.id);
      if (!shop) {
        return res.status(404).json({ success: false, message: 'Bạn chưa đăng ký cửa hàng' });
      }
      res.status(200).json({ success: true, data: shop });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  },

  // Đăng ký mở quán mới
  async create(req, res) {
    try {
      const shopData = {
        shop_name: req.body.shop_name,
        province: req.body.province,
        district: req.body.district,
        ward: req.body.ward,
        shop_address: req.body.shop_address,
        image_url: req.file ? `/uploads/${req.file.filename}` : null
      };

      const newShop = await shopService.create(req.user.id, shopData);
      res.status(201).json({ success: true, data: newShop });
    } catch (error) {
      // Lỗi do trùng user_id (đã có shop) hoặc thiếu field
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Chủ quán tự đóng/mở cửa
  async toggleOpen(req, res) {
    try {
      const { id } = req.params; // shopId
      await shopService.toggleOpen(req.user.id, parseInt(id));
      res.status(200).json({ success: true, message: 'Cập nhật trạng thái đóng/mở cửa thành công' });
    } catch (error) {
      res.status(403).json({ success: false, message: error.message });
    }
  },

  // Admin phê duyệt shop (Đổi role user -> shop_owner)
  async approve(req, res) {
    try {
      const { id } = req.params;
      const result = await shopService.approve(parseInt(id));
      res.status(200).json({
        success: true,
        message: 'Đã phê duyệt quán và cấp quyền Shop Owner cho người dùng',
        data: result
      });
    } catch (error) {
      const statusCode = error.message.includes('không tồn tại') ? 404 : 400;
      res.status(statusCode).json({ success: false, message: error.message });
    }
  },

  // Cập nhật thông tin quán
  async update(req, res) {
    try {
      const { id } = req.params;
      // Nếu có upload ảnh mới ở trang sửa
      if (req.file) {
        req.body.image_url = `/uploads/${req.file.filename}`;
      }
      
      const result = await shopService.update(parseInt(id), req.body);
      res.status(200).json({ success: true, data: result });
    } catch (error) {
      res.status(400).json({ success: false, message: error.message });
    }
  },

  // Xóa shop
  async delete(req, res) {
    try {
      const { id } = req.params;
      await shopService.delete(parseInt(id));
      res.status(200).json({ success: true, message: 'Đã xóa cửa hàng thành công' });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
};

module.exports = shopController;