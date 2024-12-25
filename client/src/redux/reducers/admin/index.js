import { combineReducers } from '@reduxjs/toolkit';
import sellerReducer, { fetchSellers, setSellersPagination } from './sellerReducer';

const adminReducer = combineReducers({
    sellers: sellerReducer,
    // Add other admin reducers here
    // users: userReducer,
    // roles: roleReducer,
});

// Re-export actions and thunks
export { fetchSellers, setSellersPagination };

export default adminReducer;
