import { createSlice } from '@reduxjs/toolkit';
import { fetchSellers, fetchOneSeller } from '../../actions/admin/sellerManagementAction';

const sellerSlice = createSlice({
    name: 'adminSellers',
    initialState: {
        data: [],
        currentSeller: null, 
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
                state.data = action.payload.sellers; 
                state.pagination.total = action.payload.totalCount;
                state.pagination.current = action.payload.currentPage;
                state.pagination.pageSize = action.payload.pageSize;
                state.loading = false;
            })
            .addCase(fetchSellers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
                state.data = [];
            })
            .addCase(fetchOneSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOneSeller.fulfilled, (state, action) => {
                state.currentSeller = action.payload.seller; // Updated to match API response
                state.loading = false;
            })
            .addCase(fetchOneSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
                state.currentSeller = null;
            });
    }
});

export const { setSellersPagination, clearSellersError } = sellerSlice.actions;
export default sellerSlice.reducer;