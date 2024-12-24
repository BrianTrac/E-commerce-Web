// redux/reducers/admin/index.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:5000/api';

export const fetchSellers = createAsyncThunk(
    'admin/fetchSellers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/sellers`);
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch sellers');
            return rejectWithValue(error.response?.data);
        }
    }
);

export const updateSellerStatus = createAsyncThunk(
    'admin/updateSellerStatus',
    async ({ sellerId, status }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`${BASE_URL}/sellers/${sellerId}/status`, { status });
            toast.success('Seller status updated successfully');
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to update seller status');
            return rejectWithValue(error.response?.data);
        }
    }
);

const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        sellers: {
            data: [],
            loading: false,
            error: null,
            pagination: {
                current: 1,
                pageSize: 10,
                total: 0
            }
        }
    },
    reducers: {
        setSellersPagination: (state, action) => {
            state.sellers.pagination = { ...state.sellers.pagination, ...action.payload };
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Sellers
            .addCase(fetchSellers.pending, (state) => {
                state.sellers.loading = true;
                state.sellers.error = null;
            })
            .addCase(fetchSellers.fulfilled, (state, action) => {
                state.sellers.data = action.payload.data;
                state.sellers.pagination.total = action.payload.total;
                state.sellers.loading = false;
            })
            .addCase(fetchSellers.rejected, (state, action) => {
                state.sellers.loading = false;
                state.sellers.error = action.payload;
            })
            // Update Seller Status
            .addCase(updateSellerStatus.fulfilled, (state, action) => {
                const index = state.sellers.data.findIndex(seller => seller.id === action.payload.id);
                if (index !== -1) {
                    state.sellers.data[index] = action.payload;
                }
            });
    }
});

export const { setSellersPagination } = adminSlice.actions;
export default adminSlice.reducer;