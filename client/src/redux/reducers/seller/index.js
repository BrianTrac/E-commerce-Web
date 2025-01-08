import { combineReducers } from '@reduxjs/toolkit';
import productReducer, { fetchProducts, setProductsPagination } from './productReducer';

const sellerReducer = combineReducers({
    products: productReducer,
    // Add other seller reducers here
});

export { fetchProducts, setProductsPagination };
export default sellerReducer;
