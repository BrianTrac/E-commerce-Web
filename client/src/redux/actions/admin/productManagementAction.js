import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
const { useAxiosPrivate } = require('../../../hooks/useAxiosPrivate');

const axios = useAxiosPrivate;

export const fetchAllProducts = createAsyncThunk(
    'admin/products/fetchProducts',
    async ({ axiosInstance, page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/products', {
                params: { page, limit, search },
            });
            return {
                products: response.data.data,
                totalCount: response.data.total,
                currentPage: response.data.page,
                pageSize: response.data.limit,
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch products';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const fetchOneProduct = createAsyncThunk(
    'admin/products/fetchOneProduct',
    async ({ productId, axiosInstance }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/admin/products/${productId}`);
            console.log('API Response:', response.data.data[0]);
            return response.data.data; // Access the first element of the data array
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch product';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const deleteProduct = createAsyncThunk(
    'admin/products/delete',
    async ({ id, axiosInstance }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/api/admin/products/${id}/suspend`);
            return response.data.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const restoreProduct = createAsyncThunk(
    'admin/products/restore',
    async ({ id, axiosInstance }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/api/admin/products/${id}/restore`);
            return response.data.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);