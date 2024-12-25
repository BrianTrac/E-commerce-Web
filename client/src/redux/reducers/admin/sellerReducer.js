import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../../config/axios';
import { toast } from 'react-toastify';

export const fetchSellers = createAsyncThunk(
    'admin/sellers/fetchAll',
    async ({ page, limit, search }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/admin/seller`, {
                params: { page, limit, search }
            });
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch sellers');
            return rejectWithValue(error.response?.data);
        }
    }
);

export const fetchOneSeller = createAsyncThunk(
    'admin/sellers/fetchOne',
    async (id, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/api/admin/seller/${id}`);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch seller details');
            return rejectWithValue(error.response?.data);
        }
    }
);

const sellerSlice = createSlice({
    name: 'adminSellers',
    initialState: {
        data: [],
        loading: false,
        error: null,
        pagination: {
            current: 1,
            pageSize: 10,
            total: 0
        }
    },
    reducers: {
        setSellersPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearSellersError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSellers.fulfilled, (state, action) => {
                state.data = action.payload.data;
                state.pagination.total = action.payload.total;
                state.pagination.current = action.payload.page;
                state.pagination.pageSize = action.payload.limit;
                state.loading = false;
            })
            .addCase(fetchSellers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = [];
            })
            .addCase(fetchOneSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOneSeller.fulfilled, (state, action) => {
                state.currentSeller = action.payload.data[0];
                state.loading = false;
            })
            .addCase(fetchOneSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.currentSeller = null;
            });
    }
});

export const { setSellersPagination, clearSellersError } = sellerSlice.actions;
export default sellerSlice.reducer;