// import axios from '../../../config/axios';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import * as error from "antd";
const { useAxiosPrivate } = require('../../../hooks/useAxiosPrivate');

const axios = useAxiosPrivate;

export const fetchUsers = createAsyncThunk(
    'admin/users/fetchAll',
    async ({ axiosInstance, page = 1, limit = 10 }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get('/api/admin/user', {
                params: { page, limit },
            });
            return {
                users: response.data.data,
                totalCount: response.data.total,
                currentPage: response.data.page,
                pageSize: response.data.limit,
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const fetchOneUser = createAsyncThunk(
    'admin/users/fetchOne',
    async ({ axiosInstance, id }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/admin/user/${id}`);
            return {
                user: response.data.data
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch user details';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const fetchUserProducts = createAsyncThunk(
    'admin/users/fetchProducts',
    async ({ axiosInstance, id, page = 1, limit = 10}, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/admin/user/${id}/products`, {
                params: { page, limit },
            });
            return {
                products: response.data.data,
                totalCount: response.data.total,
                currentPage: response.data.page,
                pageSize: response.data.limit,
            };
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch user products';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);

export const fetchUserOrderList = createAsyncThunk(
    'admin/users/fetchUserOrderList',
    async ({ axiosInstance, id, page = 1, limit = 10 }, { rejectWithValue }) => {
        console.log('fetchUserOrderList:', id);
        try {
            const response = await axiosInstance.get(`/api/admin/user/${id}/products`, {
                params: { page, limit },
            })
            return {
                products: response.data.data,
                totalCount: response.data.total,
                currentPage: response.data.page,
                pageSize: response.data.limit,
            }

        } catch (error) {
            const errorMessage = error.response?.data?.message || error.message;
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
)

export const deactivateUser = createAsyncThunk(
    'admin/deactivateUser',
    async ({ userId, axiosInstance }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/api/admin/user/${userId}/deactivate`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to deactivate user',
                status: error.response?.status
            });
        }
    }
);

export const activateUser = createAsyncThunk(
    'admin/activateUser',
    async ({ userId, axiosInstance }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.put(`/api/admin/user/${userId}/activate`);
            return response.data.data;
        } catch (error) {
            return rejectWithValue({
                message: error.response?.data?.message || 'Failed to activate user',
                status: error.response?.status
            });
        }
    }
);

export const fetchUserTotalSpent = createAsyncThunk(
    'admin/users/fetchUserTotalSpent',
    async ({ id, axiosInstance }, { rejectWithValue }) => {
        try {
            const response = await axiosInstance.get(`/api/admin/user/${id}/total-spent`);
            return response.data.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || 'Failed to fetch total spent';
            toast.error(errorMessage);
            return rejectWithValue({ message: errorMessage });
        }
    }
);