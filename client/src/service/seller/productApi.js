// services/productApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const getProductById = async (id) => {
    try {
        const response = await axios.get(`${BASE_URL}/seller/products/detail/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch product detail');
    }
};

export const addProduct = async (productData) => {
  try {
      const response = await axios.post(`${BASE_URL}/seller/products/add`, productData);
      return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.message || 'Failed to add product');
  }
};

export const getTopSellingProducts = async (storeId) => {
    try {
        const response = await axios.get(`${BASE_URL}/seller/products/top-selling/${storeId}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch top selling products');
    }
}
