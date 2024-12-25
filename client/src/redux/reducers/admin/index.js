import { combineReducers } from '@reduxjs/toolkit';
import sellerReducer, { fetchSellers, setSellersPagination } from './sellerReducer';

const adminReducer = combineReducers({
    sellers: sellerReducer,
    // Add other admin reducers here
    // users: userReducer,
    // roles: roleReducer,
});

export { fetchSellers, setSellersPagination };

export default adminReducer;
