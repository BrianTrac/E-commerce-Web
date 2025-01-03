import { createSlice } from '@reduxjs/toolkit';

import {
    fetchUsers,
    fetchOneUser,
    activateUser,
    deactivateUser,
    fetchUserOrderList,
    fetchUserTotalSpent
} from '../../actions/admin/userManagementAction';

const userSlice = createSlice({
    name: 'adminUsers',
    initialState: {
        data: [],
        currentUser: null,
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
        setUsersPagination: (state, action) => {
            state.pagination = { ...state.pagination, ...action.payload };
        },
        clearUsersError: (state) => {
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Users
            .addCase(fetchUsers.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.data = action.payload.users;
                state.pagination.total = action.payload.totalCount;
                state.pagination.current = action.payload.currentPage;
                state.pagination.pageSize = action.payload.pageSize;
                state.loading = false;
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
                state.data = [];
            })
            // Fetch One User
            .addCase(fetchOneUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchOneUser.fulfilled, (state, action) => {
                state.currentUser = action.payload.user;
                state.loading = false;
            })
            .addCase(fetchOneUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
                state.currentUser = null;
            })
            // Fetch User Total Spent
            .addCase(fetchUserTotalSpent.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchUserTotalSpent.fulfilled, (state, action) => {
                state.totalSpent = action.payload.total_spent;
                state.orderCount = action.payload.order_count;
                state.loading = false;
            })
            .addCase(fetchUserTotalSpent.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
                state.totalSpent = null;
                state.orderCount = null;
            })
            // Fetch User Order List
            .addCase(fetchUserOrderList.pending, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(fetchUserOrderList.fulfilled, (state, action) => {
                state.currentUser = action.payload;
                state.loading = false;
            })
            .addCase(fetchUserOrderList.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'An error occurred';
                state.currentUser = null;
            })
            // Deactivate User
            .addCase(deactivateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deactivateUser.fulfilled, (state, action) => {
                state.loading = false;
                // Update the user's status in the list
                state.data = state.data.map(user =>
                    user.id === action.payload.id
                        ? { ...user, is_active: false }
                        : user
                );
                // Update currentUser if it's the same user
                if (state.currentUser && state.currentUser.id === action.payload.id) {
                    state.currentUser = { ...state.currentUser, is_active: false };
                }
            })
            .addCase(deactivateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to deactivate user';
            })

            // Activate User
            .addCase(activateUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(activateUser.fulfilled, (state, action) => {
                state.loading = false;
                // Update the user's status in the list
                state.data = state.data.map(user =>
                    user.id === action.payload.id
                        ? { ...user, is_active: true }
                        : user
                );
                // Update currentUser if it's the same user
                if (state.currentUser && state.currentUser.id === action.payload.id) {
                    state.currentUser = { ...state.currentUser, is_active: true };
                }
            })
            .addCase(activateUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || 'Failed to activate user';
            });
    }
});

export const { setUsersPagination, clearUsersError } = userSlice.actions;
export default userSlice.reducer;