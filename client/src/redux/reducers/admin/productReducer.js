import { createSlice } from '@reduxjs/toolkit';
import { fetchAllProducts, fetchOneProduct } from '../../actions/admin/productManagementAction';

const productSlice = createSlice({
    name: 'adminProducts',
    initialState: {
        data: [],
        currentProduct: null,
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
            // Fetch All Products
            .addCase(fetchAllProducts.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllProducts.fulfilled, (state, action) => {
                state.data = action.payload.products;
                state.pagination.total = action.payload.totalCount;
                state.pagination.current = action.payload.currentPage;
                state.pagination.pageSize = action.payload.pageSize;
                state.loading = false;
            })
            .addCase(fetchAllProducts.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
                state.data = [];
            })

            // Fetch One Product
            .addCase(fetchOneProduct.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOneProduct.fulfilled, (state, action) => {
                state.currentProduct = action.payload[0];
                state.loading = false;
            })
            .addCase(fetchOneProduct.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
                state.currentProduct = null;
            })
    }
});

export const { setProductsPagination, clearProductsError } = productSlice.actions;
export default productSlice.reducer;