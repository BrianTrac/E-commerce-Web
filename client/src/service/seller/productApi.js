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
        console.log(productData);
        const response = await axios.post(`${BASE_URL}/seller/products/add`, productData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add product');
    }
};

export const deleteProductById = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/seller/products/remove/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
};

export const updateProduct = async (id, productData) => {
    try {
        const response = await axios.put(`${BASE_URL}/seller/products/update/${id}`, productData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update product');
    }
};

export const getProductsByStatus = async (storeId, status, page = 1, limit = 10, search = '') => {
    try {
        const response = await axios.get(`${BASE_URL}/seller/products/${storeId}`, {
            params: { status, page, limit, search },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch products by status');
    }
};