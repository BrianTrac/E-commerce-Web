import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const fetchRecentOrders = createAsyncThunk(
    '/admin/statistic/orders',
    async ({ axiosInstance, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/statistic/orders', {
                params: { limit },
            });
            return {
                orders: response.data.data,
                totalCount: response.data.total,
                limit: response.data.limit,
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch recent orders';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const fetchRecentCustomers = createAsyncThunk(
    '/admin/statistic/customers',
    async ({ axiosInstance, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/statistic/customers', {
                params: { limit },
            });
            return {
                customers: response.data.data,
                totalCount: response.data.total,
                limit: response.data.limit,
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch recent customers';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const fetchTopSellers = createAsyncThunk(
    '/admin/statistic/topSellers',
    async ({ axiosInstance, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/statistic/topSellers', {
                params: { limit },
            });
            return {
                topSellers: response.data.data,
                totalCount: response.data.total,
                limit: response.data.limit,
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch top sellers';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const fetchUserGrowth = createAsyncThunk(
    '/admin/statistic/userGrowth',
    async ({ axiosInstance }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/statistic/userGrowth');
            console.log(response.data, "HIJK");
            return {
                userGrowth: response.data.data,
                totalUsers: response.data.total_users,
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch user growth';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);