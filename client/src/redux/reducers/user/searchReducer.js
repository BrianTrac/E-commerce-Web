import { createSlice } from "@reduxjs/toolkit";
import { fetchSearchResults, fetchSuggestions } from "../../actions/user/searchAction";

const searchSlice = createSlice({
    name: 'search',
    initialState: {
        query: '',
        error: '',
        status: 'idle',
        suggestions: [],
    },
    reducers: {
        setSearchQuery: (state, action) => {
            state.query = action.payload;
        },
        resetSearchQuery: (state) => {
            state.query = '';
        },
        clearSuggestions: (state) => {
            state.suggestions = [];
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchSuggestions.pending, (state) => {
            state.status = 'loading';
            state.error = null;
        });
        builder.addCase(fetchSuggestions.fulfilled, (state, action) => {
            state.status = 'succeeded';
            state.suggestions = action.payload;
        });
        builder.addCase(fetchSuggestions.rejected, (state, action) => {
            state.error = action.payload;
            state.status = 'failed';
        });
    }
});

export const { clearSuggestions, setSearchQuery, resetSearchQuery } = searchSlice.actions;
export const selectSearch = (state) => state.user.search;
export const selectSearchQuery = (state) => state.user.search.query;
export const selectSearchSuggestions = (state) => state.user.search.suggestions;
export const selectSearchError = (state) => state.user.search.error;    
export const selectSearchStatus = (state) => state.user.search.status;
export default searchSlice.reducer;
