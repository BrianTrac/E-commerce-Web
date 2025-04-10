// services/productApi.js
import axios from '../../config/axios';

const BASE_URL = process.env.REACT_APP_SERVER_URL + '/api';

export const getProductById = async (axiosPrivate, id) => {
    try {
        const response = await axiosPrivate.get(`/api/seller/products/detail/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch product detail');
    }
};

export const getTopSellingProducts = async (axiosPrivate, storeId) => {
    try {
        const response = await axiosPrivate.get(`/api/seller/products/${storeId}/top-selling`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch top-selling products');
    }
};

export const getTopSellingProductInDashboard = async (axiosPrivate, currentPage, pageSize) => {
    try {
        const response = await axiosPrivate.get(`/api/seller/products/top-selling/`, {
            params: { currentPage, pageSize },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch top-selling products');
    }
};

export const addProduct = async (axiosPrivate, productData) => {
    try {
        const response = await axiosPrivate.post(`/api/seller/products/add`, productData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to add product');
    }
};

export const deleteProductById = async (axiosPrivate, id) => {
    try {
        const response = await axiosPrivate.delete(`/api/seller/products/remove/${id}`);
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.response?.data?.message || 'Failed to delete product');
    }
};

export const deleteMultipleProductsById = async (axiosPrivate, ids) => {
    try {
        const response = await axiosPrivate.post(`/api/seller/products/remove-multiple`, { ids });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to delete products');
    }
}

export const updateProduct = async (axiosPrivate, id, productData) => {
    try {
        const response = await axiosPrivate.patch(`/api/seller/products/update/${id}`, productData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update product');
    }
};

export const getProductsByStatus = async (axiosPrivate, status, page = 1, limit = 10, search = '', sortField = '', sortOrder = '') => {
    try {
        const response = await axiosPrivate.get(`${BASE_URL}/seller/products`, {
            params: { status, page, limit, search, sortField, sortOrder },
        });
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch products by status');
    }
};



export const getTotalProducts = async (axiosPrivate) => {
    try {
        const response = await axiosPrivate.get(`/api/seller/products/total`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch total products');
    }
};

export const getTotalFollowers = async (axiosPrivate) => {
    try {
        const response = await axiosPrivate.get(`/api/seller/followers/total`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch total followers');
    }
};

export const getTotalReviews = async (axiosPrivate) => {
    try {
        const response = await axiosPrivate.get(`/api/seller/reviews/total`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch total reviews');
    }
};

export const getTotalRevenue = async (axiosPrivate) => {
    try {
        const response = await axiosPrivate.get(`/api/seller/revenue/total`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch total revenue');
    }
};

export const checkProductExist = async (axiosPrivate, id) => {
    try {
        const response = await axiosPrivate.get(`/api/seller/products/exist/${id}`);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to check product existence');
    }
}

export const getAllProducts = async ({axiosPrivate,  page = 1, limit = 10, search = '' }) => {
    try {
        const response = await axiosPrivate.get(`/api/seller/products`, {
            params: { page, limit, search },
        });

        if (response.data && Array.isArray(response.data.data)) {
            return {
                data: response.data.data,
                total: response.data.total,
                page: response.data.page,
                limit: response.data.limit,
            };
        } else {
            throw new Error('Invalid response structure');
        }
    } catch (error) {
        console.error('Error fetching products:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
};