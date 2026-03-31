import axiosClient from '../api/axiosClient';

const BASE_URL = 'FoodO/categories'; 

const categoryService = {
  getAllCategories: async () => {
    const response = await axiosClient.get(`${BASE_URL}/`); 
    return response; 
  }
};

export default categoryService;