const Shop = require('../models/Shop');
const User = require('../models/User');

const shopService = {
  // Lấy danh sách shop (cho Admin hoặc Trang chủ)
  async getAll(filters = {}) {
    return await Shop.findAll(filters);
  },

  // Lấy chi tiết shop
  async getById(id) {
    const shop = await Shop.findById(id);
    if (!shop) throw new Error('Cửa hàng không tồn tại');
    return shop;
  },

  // Lấy shop theo User ID (Dùng để check 1 user - 1 shop)
  async getByUserId(userId) {
    return await Shop.getByUserId(userId);
  },

  // Tạo shop mới
  async create(userId, shopData) {
    if (!shopData.shop_name) throw new Error('Tên cửa hàng là bắt buộc');

    // Strict check: Mỗi user chỉ được 1 shop nhờ cột UNIQUE trong DB
    const existing = await Shop.getByUserId(userId);
    if (existing) {
        throw new Error('Bạn đã đăng ký một cửa hàng trên hệ thống rồi');
    }

    const finalData = {
      ...shopData,
      user_id: userId
    };

    return await Shop.create(finalData);
  },

  // Cập nhật thông tin shop
  async update(id, updateData) {
    const shop = await Shop.findById(id);
    if (!shop) throw new Error('Cửa hàng không tồn tại');
    return await Shop.update(id, updateData);
  },

  // Admin phê duyệt shop
  async approve(id) {
    const shop = await Shop.findById(id);
    if (!shop) throw new Error('Cửa hàng không tồn tại');
    
    await Shop.approve(id);

    await User.update(shop.user_id, { role: 'shop_owner' });
    
    return await Shop.findById(id);
  },

  // Chủ quán chủ động đóng/mở cửa
  async toggleOpen(userId, shopId) {
    const shop = await Shop.findById(shopId);
    if (!shop) throw new Error('Cửa hàng không tồn tại');

    // Bảo mật: Chỉ chủ quán mới được đóng/mở quán của mình
    if (shop.user_id != userId) {
      throw new Error('Bạn không có quyền thực hiện thao tác này');
    }

    return await Shop.toggleOpenStatus(shopId);
  },

  // Xóa shop
  async delete(id) {
    const shop = await Shop.findById(id);
    if (!shop) throw new Error('Cửa hàng không tồn tại');
    return await Shop.delete(id);
  }
};

module.exports = shopService;