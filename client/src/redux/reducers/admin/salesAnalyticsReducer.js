import { createSlice } from '@reduxjs/toolkit';
import { fetchRecentOrders, fetchRecentCustomers, fetchTopSellers, fetchUserGrowth } from '../../actions/admin/salesAnalyticsAction';

const initialState = {
    recentOrders: {
        data: [],
        totalCount: 0,
        limit: 10,
        loading: false,
        error: null
    },
    recentCustomer: {
        data: [],
        totalCount: 0,
        limit: 10,
        loading: false,
        error: null
    },
    topSellers:{
        data: [],
        totalCount: 0,
        limit: 10,
        loading: false,
        error: null
    },
    userGrowth: {
        data: [],
        totalCount: 0,
        loading: false,
        error: null
    }
};

const salesAnalyticsSlice = createSlice({
    name: 'salesAnalytics',
    initialState,
    reducers: {
        clearSalesAnalytics: (state) => {
            state.recentOrders = initialState.recentOrders;
            state.recentCustomer = initialState.recentCustomer;
            state.topSellers = initialState.topSellers;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle fetchRecentOrders
            .addCase(fetchRecentOrders.pending, (state) => {
                state.recentOrders.loading = true;
                state.recentOrders.error = null;
            })
            .addCase(fetchRecentOrders.fulfilled, (state, action) => {
                state.recentOrders.loading = false;
                state.recentOrders.data = action.payload.orders;
                state.recentOrders.totalCount = action.payload.totalCount;
                state.recentOrders.limit = action.payload.limit;
            })
            .addCase(fetchRecentOrders.rejected, (state, action) => {
                state.recentOrders.loading = false;
                state.recentOrders.error = action.payload?.message || 'An error occurred';
            })
            // Handle fetchRecentCustomers
            .addCase(fetchRecentCustomers.pending, (state) => {
                state.recentCustomer.loading = true;
                state.recentCustomer.error = null;
            })
            .addCase(fetchRecentCustomers.fulfilled, (state, action) => {
                state.recentCustomer.loading = false;
                state.recentCustomer.data = action.payload.customers;
                state.recentCustomer.totalCount = action.payload.totalCount;
                state.recentCustomer.limit = action.payload.limit;
            })
            .addCase(fetchRecentCustomers.rejected, (state, action) => {
                state.recentCustomer.loading = false;
                state.recentCustomer.error = action.payload?.message || 'An error occurred';
            })
            // Handle fetchTopSellers
            .addCase(fetchTopSellers.pending, (state) => {
                state.topSellers.loading = true;
                state.topSellers.error = null;
            })
            .addCase(fetchTopSellers.fulfilled, (state, action) => {
                state.topSellers.loading = false;
                state.topSellers.data = action.payload.topSellers;
                state.topSellers.totalCount = action.payload.totalCount;
                state.topSellers.limit = action.payload.limit;
            })
            .addCase(fetchTopSellers.rejected, (state, action) => {
                state.topSellers.loading = false;
                state.topSellers.error = action.payload?.message || 'An error occurred';
            })
            // Handle fetchUserGrowth
            .addCase(fetchUserGrowth.pending, (state) => {
                state.userGrowth.loading = true;
                state.userGrowth.error = null;
            })
            .addCase(fetchUserGrowth.fulfilled, (state, action) => {
                state.userGrowth.loading = false;
                state.userGrowth.data = action.payload.userGrowth;
                state.userGrowth.totalCount = action.payload.totalUsers;
            })
            .addCase(fetchUserGrowth.rejected, (state, action) => {
                state.userGrowth.loading = false;
                state.userGrowth.error = action.payload?.message || 'An error occurred';
            });
    }
});

// Export actions
export const { clearSalesAnalytics } = salesAnalyticsSlice.actions;

// Export selectors
export const selectRecentOrders = (state) => state.admin.salesAnalytics.recentOrders;
export const selectRecentCustomers = (state) => state.admin.salesAnalytics.recentCustomer;
export const selectTopSellers = (state) => state.admin.salesAnalytics.topSellers;
export const selectUserGrowth = (state) => state.admin.salesAnalytics.userGrowth;
// Export reducer
export default salesAnalyticsSlice.reducer;