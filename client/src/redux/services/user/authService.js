import axios from '../../../config/axios';

// Login function
const login = async ({ username, password, type }) => {
    const response = await axios.post('api/auth/login',
        JSON.stringify({ username, password, type }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
    return response.data;
};

// Register function
const register = async ({ username, password, email, type }) => {
    const response = await axios.post('api/auth/register',
        JSON.stringify({ username, password, email, type }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
    return response.data;
};

// Verify OTP function
const verifyOTP = async ({ email, otp }) => {
    const response = await axios.post('api/auth/register/verify-otp',
        JSON.stringify({ email, otp }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
    return response.data;
};

// Resend OTP function
const resendOTP = async ({ email }) => {
    const response = await axios.post('api/auth/register/resend-otp',
        JSON.stringify({ email }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
    return response.data;
};

// Logout function
const logout = async ({ axiosPrivate }) => {
    const response = await axiosPrivate.post('api/auth/logout', {}, {
        withCredentials: true
    });
    return response.data;
};

// Google login function
const googleLogin = () => {
    window.location.href = `${SERVER_URL}/api/auth/google`;
};

// Forgot password function
const forgotPassword = async ({ email }) => {
    const response = await axios.post('api/auth/forget-password',
        JSON.stringify({ email }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
    return response.data;
};

// Reset password function
const resetPassword = async ({ email, newPassword }) => {
    const response = await axios.post('api/auth/reset-password',
        JSON.stringify({ email, newPassword }),
        {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true
        });
    return response.data;
};

// Refresh token function
const refreshToken = async () => {
  
    const response = await axios.post('api/auth/token/refresh', null, {
        withCredentials: true,
    });
    return response.data;
};

export default {
    login,
    register,
    logout,
    googleLogin,
    verifyOTP,
    resendOTP,
    forgotPassword,
    resetPassword,
    refreshToken,
};