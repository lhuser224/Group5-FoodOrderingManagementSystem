import axiosClient from '../api/axiosClient';

export const registerShop = async (formData) => {
  return await axiosClient.post('/FoodO/shops', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });
};

export const getMyShopInfo = async () => {
  return await axiosClient.get('/FoodO/shops/me/info');
};
export const toggleShopOpen = async (shopId) => {
  return await axiosClient.patch(`/FoodO/shops/${shopId}/toggle-open`);
};

export const updateShop = async (shopId, updateData) => {
  return await axiosClient.patch(`/FoodO/shops/${shopId}`, updateData);
};

export default {
  registerShop,
  getMyShopInfo,
  toggleShopOpen,
  updateShop
};