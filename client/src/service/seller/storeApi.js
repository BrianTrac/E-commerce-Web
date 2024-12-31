// services/productApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const getStore = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/seller/store`);
      return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch seller info');
    }
};
