import { createSlice } from "@reduxjs/toolkit";
import { fetchChildrenCategories, fetchAncestorCategories } from "../../actions/user/categoryAction";

const initialState = {
    childrenCategories: [],
    ancestorCategories: [],
    error: '',
    status: 'idle',
};

const categorySlice = createSlice({
    name: 'category',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // Handle child categories
        builder.addCase(fetchChildrenCategories.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(fetchChildrenCategories.fulfilled, (state, action) => {
            state.childrenCategories = action.payload;
            state.status = 'succeeded';
        });
        builder.addCase(fetchChildrenCategories.rejected, (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        });

        // Handle ancestor categories
        builder.addCase(fetchAncestorCategories.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(fetchAncestorCategories.fulfilled, (state, action) => {
            state.ancestorCategories = action.payload;
            state.status = 'succeeded';
        });
        builder.addCase(fetchAncestorCategories.rejected, (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        });
    }
});

export default categorySlice.reducer;
export const { clearError } = categorySlice.actions;

// Selector
export const selectCategory = (state) => state.user.category;
export const selectChildrenCategories = (state) => state.user.category.childrenCategories;
export const selectAncestorCategories = (state) => state.user.category.ancestorCategories;
export const selectCategoryError = (state) => state.user.category.error;
export const selectCategoryStatus = (state) => state.user.category.status;