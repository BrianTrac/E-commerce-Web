import { createAsyncThunk } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';
import authServices from '../../services/user/authService';

export const login = createAsyncThunk(
    'auth/login',
    async ({ username, password, type }, { rejectWithValue }) => {
        try {
            const response = await authServices.login({ username, password, type });
            console.log('response: ', response);

            const accessToken = response?.accessToken;
            if (accessToken) {
                const decodedToken = jwtDecode(accessToken);
                console.log('decodedToken: ', decodedToken);
                const role = decodedToken?.role;
                const email = decodedToken?.email;
                return { username, email, accessToken, role };
            }
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message);
        }
    }
);

export const register = createAsyncThunk(
    'auth/register',
    async ({ username, email, password, type }, { rejectWithValue }) => {
        try {
            
            const response = await authServices.register({ username, email, password, type });
            
            return {email: email, message: response?.message};
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message);
        }
    }
);  

export const verifyOTP = createAsyncThunk(
    'auth/verifyOTP',
    async ({ email, otp }, { rejectWithValue }) => {
        try {
            const response = await authServices.verifyOTP({ email, otp });
            if (response?.success && response?.message) {
                return response.message;
            }
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message);
        }
    }
);

export const resendOTP = createAsyncThunk(
    'auth/resendOTP',
    async ({ email }, { rejectWithValue }) => {
        try {
            
            const response = await authServices.resendOTP({ email });
            if (response?.success && response?.message) {
                return response.message;
            }
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message);
        }
    }
);

export const forgotPassword = createAsyncThunk(
    'auth/forgotPassword',
    async ({ email }, { rejectWithValue }) => {
        try {
            const response = await authServices.forgotPassword({ email });
                
            return response.message;
        
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message);
        }
    }
);

export const resetPassword = createAsyncThunk(
    'auth/resetPassword',
    async ({ email, newPassword }, { rejectWithValue }) => {
        try {
            const response = await authServices.resetPassword({ email, newPassword });
            
            return response.message;
            
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message);
        }
    }
);

export const refreshToken = createAsyncThunk(
    'auth/refreshToken',
    async (_, { rejectWithValue }) => {
        try {          
            const response = await authServices.refreshToken();
            
            const accessToken = response?.accessToken;
            if (accessToken) {
                const decodedToken = jwtDecode(accessToken);
                const role = decodedToken?.role;
                const email = decodedToken?.email;
                const username = decodedToken?.username;
                console.log('accessToken', accessToken);    
                return { accessToken, role, email, username };
            }
            
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message);
        }
    }
);

export const logout = createAsyncThunk(
    'auth/logout',
    async ( {axiosPrivate}, { rejectWithValue }) => {
        try {
            const response = await authServices.logout({ axiosPrivate });
            return response.message;
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message);
        }
    }
);






