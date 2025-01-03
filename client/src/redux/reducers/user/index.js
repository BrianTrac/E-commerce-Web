import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './authReducer';
import categoryReducer from './categoryReducer';
import searchReducer from './searchReducer';
import cartReducer from './cartReducer';

const userReducer = combineReducers({
    auth: authReducer,
    category: categoryReducer,
    search: searchReducer,
    cart: cartReducer,
    // Add other user reducers here
});

export default userReducer;