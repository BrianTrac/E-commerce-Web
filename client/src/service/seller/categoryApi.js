// services/categoryApi.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000/api';

export const getAllCategories = async ({ page = 1, limit = 10, search = '' }) => {
    try {
        // Gửi yêu cầu với các tham số: page, limit, và search
        const response = await axios.get(`${BASE_URL}/seller/categories`, {
            params: { page, limit, search },
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