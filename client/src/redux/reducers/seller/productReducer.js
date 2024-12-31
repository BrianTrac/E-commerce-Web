import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import { toast } from 'react-toastify';

const BASE_URL = 'http://localhost:5000/api';

export const fetchProducts = createAsyncThunk(
    'seller/products/fetchAll',
    async ({ storeId, page, limit, search }, { rejectWithValue }) => {
        try {
            if(!storeId) {
              storeId = '40395';
            }
            const response = await axios.get(`${BASE_URL}/seller/products/${storeId}`, {
                params: { page, limit, search }
            });
            return response.data;
        } catch (error) {
            toast.error(error.response?.data?.message || 'Failed to fetch products');
            return rejectWithValue(error.response?.data);
        }
    }
);

const productSlice = createSlice({
    name: 'sellerProducts',
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
        setProductsPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearProductsError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
              state.data = action.payload.data.map((product) => ({
                ...product,
                price: Number(product.price) || 0, // Đảm bảo price là number
                rating: Number(product.rating) || 0, // Đảm bảo rating là number
            }));
                state.pagination.total = action.payload.total;
                state.pagination.current = action.payload.page;
                state.pagination.pageSize = action.payload.limit;
                state.loading = false;
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.data = [];
            });
    }
});

export const { setProductsPagination } = productSlice.actions;
export default productSlice.reducer;