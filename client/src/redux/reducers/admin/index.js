import { combineReducers } from '@reduxjs/toolkit';
import sellerReducer from './sellerReducer';
import userReducer from './userReducer';
import productReducer from './productReducer';
import salesAnalyticsReducer from './salesAnalyticsReducer';

const adminReducer = combineReducers({
    sellers: sellerReducer,
    users: userReducer,
    product: productReducer,
    salesAnalytics: salesAnalyticsReducer,
});

export default adminReducer;