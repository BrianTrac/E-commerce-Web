import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/user";

const store = configureStore({
    reducer: {
        user: userReducer,
        // Add other role reducers here
    },
});

export default store;