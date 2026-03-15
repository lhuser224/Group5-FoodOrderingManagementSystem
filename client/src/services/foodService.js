import axiosClient from '../api/axiosClient';

export const getFoods = async (shopId) => {
  try {
    const url = shopId ? `/seller/${shopId}/foods` : '/foods';
    const data = await axiosClient.get(url);
    return data;
  } catch (error) {
    console.error('Error fetching foods:', error);
    throw error;
  }
};


export const getFoodById = async (foodId) => {
  try {
    const data = await axiosClient.get(`/foods/${foodId}`);
    return data;
  } catch (error) {
    console.error('Error fetching food:', error);
    throw error;
  }
};

/**
 * Search foods by query
 * @param {string} query - Search query
 * @returns {Promise<Array>} Array of matching food items
 */
export const searchFoods = async (query) => {
  try {
    const data = await axiosClient.get('/foods/search', { params: { q: query } });
    return data;
  } catch (error) {
    console.error('Error searching foods:', error);
    throw error;
  }
};

/**
 * Add a new food item to a shop
 * @param {number} shopId - Shop ID
 * @param {Object} foodData - Food data { name, price (decimal), image_url, category_id }
 * @returns {Promise<Object>} Created food item
 */
export const addFood = async (shopId, foodData) => {
  try {
    const payload = {
      name: foodData.name,
      price: parseFloat(foodData.price), // Ensure decimal
      image_url: foodData.image_url || '',
      category_id: foodData.category_id || 1
    };
    const data = await axiosClient.post(`/seller/${shopId}/add-food`, payload);
    return data;
  } catch (error) {
    console.error('Error adding food:', error);
    throw error;
  }
};

/**
 * Update an existing food item
 * @param {number} shopId - Shop ID
 * @param {number} foodId - Food ID
 * @param {Object} foodData - Updated food data
 * @returns {Promise<Object>} Updated food item
 */
export const updateFood = async (shopId, foodId, foodData) => {
  try {
    const data = await axiosClient.patch(
      `/seller/${shopId}/foods/${foodId}`,
      foodData
    );
    return data;
  } catch (error) {
    console.error('Error updating food:', error);
    throw error;
  }
};

/**
 * Toggle food availability status
 * @param {number} shopId - Shop ID
 * @param {number} foodId - Food ID
 * @returns {Promise<Object>} Updated food item with new status
 */
export const toggleFoodStatus = async (shopId, foodId) => {
  try {
    const data = await axiosClient.patch(
      `/seller/${shopId}/foods/${foodId}/status`
    );
    return data;
  } catch (error) {
    console.error('Error toggling food status:', error);
    throw error;
  }
};

/**
 * Delete a food item
 * @param {number} shopId - Shop ID
 * @param {number} foodId - Food ID
 * @returns {Promise<Object>} Success response
 */
export const deleteFood = async (shopId, foodId) => {
  try {
    const data = await axiosClient.delete(
      `/seller/${shopId}/foods/${foodId}`
    );
    return data;
  } catch (error) {
    console.error('Error deleting food:', error);
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
  deleteFood
};
