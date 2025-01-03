import { createSlice } from '@reduxjs/toolkit';
import { fetchSellers, fetchOneSeller, fetchSellerAnalytics, activateSeller, deactivateSeller } from '../../actions/admin/sellerManagementAction';

const sellerSlice = createSlice({
    name: 'adminSellers',
    initialState: {
        data: [],
        currentSeller: null,
        analytics: null,
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
            // Fetch Sellers
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
            // Fetch One Seller
            .addCase(fetchOneSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOneSeller.fulfilled, (state, action) => {
                state.currentSeller = action.payload.seller;
                state.loading = false;
            })
            .addCase(fetchOneSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
                state.currentSeller = null;
            })
            // Deactivate Seller
            .addCase(deactivateSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deactivateSeller.fulfilled, (state, action) => {
                state.loading = false;
                // Update the seller's status in the list
                state.data = state.data.map(seller =>
                    seller.id === action.payload.id
                        ? { ...seller, isActive: false }
                        : seller
                );
                // Update currentSeller if it's the same seller
                if (state.currentSeller && state.currentSeller.id === action.payload.id) {
                    state.currentSeller = { ...state.currentSeller, isActive: false };
                }
            })
            .addCase(deactivateSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to deactivate seller';
            })

            // Activate Seller
            .addCase(activateSeller.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(activateSeller.fulfilled, (state, action) => {
                state.loading = false;
                // Update the seller's status in the list
                state.data = state.data.map(seller =>
                    seller.id === action.payload.id
                        ? { ...seller, isActive: true }
                        : seller
                );
                // Update currentSeller if it's the same seller
                if (state.currentSeller && state.currentSeller.id === action.payload.id) {
                    state.currentSeller = { ...state.currentSeller, isActive: true };
                }
            })
            .addCase(activateSeller.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to activate seller';
            })
            .addCase(fetchSellerAnalytics.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            // Fetch Seller Analytics
            .addCase(fetchSellerAnalytics.fulfilled, (state, action) => {
                state.loading = false;
                // Store analytics data in the state
                state.analytics = {
                    totalProducts: action.payload.totalProducts,
                    totalRevenue: action.payload.totalRevenue,
                    categories: action.payload.categories,
                    products: action.payload.products,
                };
            })
            .addCase(fetchSellerAnalytics.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to fetch seller analytics';
                state.analytics = null;
            })
    }
});

export const { setSellersPagination, clearSellersError } = sellerSlice.actions;
export default sellerSlice.reducer;