import { createAsyncThunk } from "@reduxjs/toolkit";
import searchServices from "../../services/user/searchService";

export const fetchSuggestions = createAsyncThunk(
    'search/fetchSuggestions',
    async ({ keyword }, { rejectWithValue }) => {
        try {
            const response = await searchServices.getSuggestions({ keyword });
            return response.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message);
        }
    }
);

export const fetchSearchResults = createAsyncThunk(
    'search/fetchSearchResults',
    async ({ keyword, limit, page, sort, rating, price }, { rejectWithValue }) => {
        try {
            const response = await searchServices.getSearchResults({ keyword, limit, page, sort, rating, price });
            return response.data;
        } catch (err) {
            return rejectWithValue(err?.response?.data?.message);
        }
    }
);