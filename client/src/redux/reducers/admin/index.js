import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:4000/api';

export const fetchSellers = createAsyncThunk(
    'admin/fetchSellers',
    async ({ page, limit, search }, { rejectWithValue }) => {
        try {
            const response = await axios.get(`${BASE_URL}/admin/seller`, {
                params: {
                    page,
                    limit,
                    search
                }
            });
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch sellers');
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
        },
        clearSellersError: (state) => {
            state.sellers.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchSellers.pending, (state) => {
                state.sellers.loading = true;
                state.sellers.error = null;
            })
            .addCase(fetchSellers.fulfilled, (state, action) => {
                state.sellers.data = action.payload.data;
                state.sellers.pagination.total = action.payload.total;
                state.sellers.pagination.current = action.payload.page;
                state.sellers.pagination.pageSize = action.payload.limit;
                state.sellers.loading = false;
            })
            .addCase(fetchSellers.rejected, (state, action) => {
                state.sellers.loading = false;
                state.sellers.error = action.payload;
                state.sellers.data = [];
            });
    }
});

export const { setSellersPagination, clearSellersError } = adminSlice.actions;
export default adminSlice.reducer;