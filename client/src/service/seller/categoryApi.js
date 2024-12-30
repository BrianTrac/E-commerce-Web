// services/categoryApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const getAllCategories = async ({ page, limit }) => {
    try {
        const response = await axios.get(`${BASE_URL}/seller/categories`, {
            params: { page, limit },
        });

        // Kiểm tra và trả về dữ liệu chính xác
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
        console.error('Error fetching categories:', error);
        throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
};
