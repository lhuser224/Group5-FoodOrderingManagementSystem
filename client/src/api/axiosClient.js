import axios from 'axios';

const axiosClient = axios.create({
  baseURL: 'http://localhost:3000/FoodO/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add JWT token to all requests
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Extract response data and handle errors
axiosClient.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const status = error.response?.status;
    
    if (status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/auth';
    } else if (status === 403) {
      console.error('Forbidden');
    } else if (status === 500) {
      console.error('Server error');
    }

    return Promise.reject(error.response?.data || error);
  }
);

export default axiosClient;
