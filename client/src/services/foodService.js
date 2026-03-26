import axiosClient from '../api/axiosClient';

export const getFoods = async (shopId) => {
  try {
    // Đổi /seller -> /shop
    const url = shopId ? `/FoodO/foods/shop/${shopId}` : '/FoodO/foods';
    return await axiosClient.get(url);
  } catch (error) {
    throw error;
  }
};

export const getFoodById = async (foodId) => {
  try {
    return await axiosClient.get(`/FoodO/foods/${foodId}`);
  } catch (error) {
    throw error;
  }
};

export const searchFoods = async (query) => {
  try {
    return await axiosClient.get('/FoodO/foods/search', { params: { q: query } });
  } catch (error) {
    throw error;
  }
};

export const addFood = async (shopId, foodData) => {
  try {
    const payload = {
      name: foodData.name,
      price: parseFloat(foodData.price),
      image_url: foodData.image_url || '',
      category_id: foodData.category_id || 1,
      description: foodData.description || ''
    };
    // Đổi /seller -> /shop
    return await axiosClient.post(`/FoodO/foods/shop/${shopId}/add-food`, payload);
  } catch (error) {
    throw error;
  }
};

export const updateFood = async (shopId, foodId, foodData) => {
  try {
    // Đổi /seller -> /shop
    return await axiosClient.patch(`/FoodO/foods/shop/${shopId}/foods/${foodId}`, foodData);
  } catch (error) {
    throw error;
  }
};

export const toggleFoodStatus = async (foodId) => {
  try {
    // Khớp với route: router.patch('/:id/status', ...)
    return await axiosClient.patch(`/FoodO/foods/${foodId}/status`);
  } catch (error) {
    throw error;
  }
};

export const getFoodsByShop = async (shopId) => {
  try {
    return await axiosClient.get(`/FoodO/foods/shop/${shopId}`);
  } catch (error) {
    throw error;
  }
};

export const getFoodsByCategory = async (categoryId) => {
  try {
    return await axiosClient.get(`/FoodO/foods/category/${categoryId}`);
  } catch (error) {
    throw error;
  }
};

export const deleteFood = async (shopId, foodId) => {
  try {
    // Đổi /seller -> /shop
    return await axiosClient.delete(`/FoodO/foods/shop/${shopId}/foods/${foodId}`);
  } catch (error) {
    throw error;
  }
};

export default {
  getFoods,
  getFoodById,
  searchFoods,
  addFood,
  updateFood,
  toggleFoodStatus,
  getFoodsByShop,
  getFoodsByCategory,
  deleteFood
};