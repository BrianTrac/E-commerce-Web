import { createAsyncThunk } from '@reduxjs/toolkit';
import categoryServices from '../../services/user/categoryService';

export const fetchChildrenCategories = createAsyncThunk(
    'category/fetchChildrenCategories',
    async ({ parentId }, { rejectWithValue }) => {
        try {
            const response = await categoryServices.getChildrenCategories({ parentId });
            return response.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message);
        }
    }
);

export const fetchAncestorCategories = createAsyncThunk(
    'category/fetchAncestorCategories',
    async ({ id }, { rejectWithValue }) => {
        try {
            const response = await categoryServices.getAncestorCategories({ id });
            return response.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message);
        }
    }
);