// services/productApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const getSellerInfo = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/seller/info`);
      return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch seller info');
    }
};

export const updateSellerInfo = async (sellerInfo) => {
    try {
        const response = await axios.patch(`${BASE_URL}/seller/info/update`, sellerInfo);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update seller info');
    }
}
