// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import userReducer from "./reducers/user";
import adminReducer from "./reducers/admin";
import sellerReducer from "./reducers/seller";

const persistConfig = {
    key: "root",
    storage,
    whitelist: ['user'] // Chỉ persist user data
};

const persistedUserReducer = persistReducer(persistConfig, userReducer);

const store = configureStore({
    reducer: {
        user: persistedUserReducer,
        admin: adminReducer, // Không cần persist admin state
        seller: sellerReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE']
            },
        }),
});

export const persistor = persistStore(store);
export default store;