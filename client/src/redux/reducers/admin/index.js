import { combineReducers } from '@reduxjs/toolkit';
import sellerReducer from './sellerReducer';

const adminReducer = combineReducers({
    sellers: sellerReducer,
    // Add other admin reducers here
    // users: userReducer,
    // roles: roleReducer,
});


export default adminReducer;
