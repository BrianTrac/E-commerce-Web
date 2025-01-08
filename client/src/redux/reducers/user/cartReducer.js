// cartReducer.js
import { createSlice } from '@reduxjs/toolkit';

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        quantity: 0,
    },
    reducers: {
        setCartQuantity(state, action) {
            state.quantity = action.payload;
        },
    },
});

export const { setCartQuantity } = cartSlice.actions;

export const selectCartQuantity = (state) => state.user.cart.quantity;

export default cartSlice.reducer;
