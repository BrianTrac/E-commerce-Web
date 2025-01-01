import { combineReducers } from '@reduxjs/toolkit';
import sellerReducer from './sellerReducer';
import userReducer from './userReducer';
import productReducer from './productReducer';

const adminReducer = combineReducers({
    sellers: sellerReducer,
    users: userReducer,
    product: productReducer,
    // Add other admin reducers here
    // users: userReducer,
    // roles: roleReducer,
});


export default adminReducer;
