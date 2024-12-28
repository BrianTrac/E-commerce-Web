// import axios from '../../../config/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
const { useAxiosPrivate } = require('../../../hooks/useAxiosPrivate');

const axios = useAxiosPrivate;
export const fetchSellers = createAsyncThunk(
    'admin/sellers/fetchAll',
    async ({ axiosInstance, page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/seller', {
                params: { page, limit, search },
            });
            return {
                sellers: response.data.data,
                totalCount: response.data.total,
                currentPage: response.data.page,
                pageSize: response.data.limit,
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);


export const fetchOneSeller = createAsyncThunk(
    'admin/sellers/fetchOne',
    async ({ axiosInstance, id }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/admin/seller/${id}`);
            return {
                seller: response.data.data[0]
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch seller details';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const fetchSellerProducts = createAsyncThunk(
    'admin/sellers/fetchProducts',
    async ({ axiosInstance, id, page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/admin/seller/${id}/products`, {
                params: { page, limit, search },
            });
            return {
                products: response.data.data,
                totalCount: response.data.total,
                currentPage: response.data.page,
                pageSize: response.data.limit,
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch seller products';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);