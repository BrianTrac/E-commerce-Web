import { createSlice } from "@reduxjs/toolkit";
import { login, register, verifyOTP, resendOTP, forgotPassword, resetPassword, refreshToken, logout} from "../../actions/user/authAction";

const initialState = {
    user: {},
    error: '',
    loading: false,
    success: '',
    isAuthenticated: false,  
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        clearSuccess: (state) => {
            state.success = null;
        },
    },
    extraReducers: (builder) => {

        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state, action) => {
            state.user = action.payload;
            state.isAuthenticated = true;
            state.loading = false;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        // Register
        builder.addCase(register.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(register.fulfilled, (state, action) => {
            state.user = action.payload.email;
            state.success = action.payload.message;
            state.loading = false;

        });
        builder.addCase(register.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        // Verify OTP
        builder.addCase(verifyOTP.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(verifyOTP.fulfilled, (state, action) => {
            state.success = action.payload;
            state.loading = false;
        });
        builder.addCase(verifyOTP.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        // Resend OTP
        builder.addCase(resendOTP.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(resendOTP.fulfilled, (state, action) => {
            state.success = action.payload;
            state.loading = false;
        });
        builder.addCase(resendOTP.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        // Forgot Password
        builder.addCase(forgotPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(forgotPassword.fulfilled, (state, action) => {
            state.success = action.payload;
            state.loading = false;
        });
        builder.addCase(forgotPassword.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        // Reset Password
        builder.addCase(resetPassword.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(resetPassword.fulfilled, (state, action) => {
            state.success = action.payload;
            state.loading = false;
        });
        builder.addCase(resetPassword.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
        });

        // Refresh access token
        builder.addCase(refreshToken.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.isAuthenticated = false;
        });
        builder.addCase(refreshToken.fulfilled, (state, action) => {
            
            state.user = {
                ...state.user,
                role: action.payload.role,
                accessToken: action.payload.accessToken,
                username: action.payload.username,
                email: action.payload.email,
            };
            state.isAuthenticated = true;
            state.loading = false;
        });
        builder.addCase(refreshToken.rejected, (state, action) => {
            state.error = action.payload;
            state.loading = false;
            state.isAuthenticated = false;
        });

        // Logout set auth state to initial state
        builder.addCase(logout.pending, (state) => {
            state.loading = true;
            state.error = null;
            state.user = {};
            state.isAuthenticated = false;
        });
    }
});


export default authSlice.reducer;
export const { clearError, clearSuccess } = authSlice.actions;

// Selectors
export const selectAuth = (state) => state.user.auth;
export const selectIsAuthenticated = (state) => state.user.auth.isAuthenticated;
export const selectUser = (state) => state.user.auth.user;
export const selectError = (state) => state.user.auth.error;
export const selectLoading = (state) => state.user.auth.loading;
export const selectSuccess = (state) => state.user.auth.success;