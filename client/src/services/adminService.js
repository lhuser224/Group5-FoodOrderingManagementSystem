import axiosClient from '../api/axiosClient';

const BASE_URL = '/FoodO/admin'; 

const adminService = {
  // Lấy danh sách các quán đang chờ duyệt
  getPendingShops: async () => {
    const response = await axiosClient.get(`${BASE_URL}/pending-shops`);
    return response;
  },

  // Phê duyệt quán dựa trên ID
  approveShop: async (id) => {
    const response = await axiosClient.patch(`${BASE_URL}/approve-shop/${id}`);
    return response;
  },

  // Lấy toàn bộ danh mục
  getCategories: async () => {
    const response = await axiosClient.get(`${BASE_URL}/categories`);
    return response;
  },

  // Tạo danh mục mới
  createCategory: async (name) => {
    const response = await axiosClient.post(`${BASE_URL}/categories`, { name });
    return response;
  },

  // Cập nhật tên danh mục 
  updateCategory: async (id, name) => {
    const response = await axiosClient.put(`${BASE_URL}/categories/${id}`, { name });
    return response;
  },

  // Bật/Tắt trạng thái hiển thị danh mục
  toggleCategory: async (id, is_active) => {
    const response = await axiosClient.patch(`${BASE_URL}/categories/${id}/toggle`, { is_active });
    return response;
  },

  // Xóa danh mục
  deleteCategory: async (id) => {
    const response = await axiosClient.delete(`${BASE_URL}/categories/${id}`);
    return response;
  },
};

export default adminService;