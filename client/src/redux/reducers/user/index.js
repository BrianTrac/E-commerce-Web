import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';

const userReducer = combineReducers({
    auth: authReducer,
    // Add other user reducers here
});

export default userReducer;