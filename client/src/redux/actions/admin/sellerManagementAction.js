import axios from '../../../config/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';

export const fetchSellers = createAsyncThunk(
    'admin/sellers/fetchAll',
    async ({ page = 1, limit = 10, search = '' }, { rejectWithValue }) => {
        try {
            const response = await axios.get('/api/admin/seller', {
                params: { page, limit, search }
            });
            return {
                sellers: response.data.data,
                totalCount: response.data.total,
                currentPage: response.data.page,
                pageSize: response.data.limit
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch sellers';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const fetchOneSeller = createAsyncThunk(
    'admin/sellers/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/admin/seller/${id}`);
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