import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import categoryReducer from './categoryReducer';
import searchReducer from './searchReducer';

const userReducer = combineReducers({
    auth: authReducer,
    category: categoryReducer,
    search: searchReducer,
    // Add other user reducers here
});

export default userReducer;