import { useState, useEffect, useRef } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { setSearchQuery, selectSearch, selectSearchQuery, clearSuggestions } from '../../redux/reducers/user/searchReducer';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { fetchSuggestions } from '../../redux/actions/user/searchAction';

const Search = () => {

    // const [searchQuery, setSearchQuery] = useState(""); 
    const { keyword } = useParams();
    const searchQuery = useSelector(selectSearchQuery);
    const { suggestions, error, status } = useSelector(selectSearch);
    const dispatch = useDispatch();
    const navigate = useNavigate(); 
    const [showSuggestions, setShowSuggestions] = useState(false);
    const searchRef = useRef(null);
    const [debouncedQuery, setDebouncedQuery] = useState('');

    //Initialize searchQuery with keyword from URL
    useEffect(() => {
        const initialSearchQuery = keyword || '';
        dispatch(setSearchQuery(initialSearchQuery));    
    }, [keyword, dispatch]);

    // Debounce searchQuery
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedQuery(searchQuery);
        }, 200);

        return () => clearTimeout(timer);
    }, [searchQuery]);

    // Fetch suggestions each time searchQuery changes
    useEffect(() => {
        if (debouncedQuery.trim().length > 1) {
            dispatch(fetchSuggestions({ keyword: debouncedQuery}));
            setShowSuggestions(true);
        }
        else {
            setShowSuggestions(false);
        }
    }, [debouncedQuery, dispatch]);

    // Handle clicks outside of search bar and dropdown
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (searchRef.current && !searchRef.current.contains(e.target)) {
                setShowSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Clear suggestions when navigating to another page
    useEffect(() => {
        debugger;
        const clearSuggestionsOnNavigate = () => {
            setShowSuggestions(false)
            dispatch(clearSuggestions());
        }
        return () => {
            clearSuggestionsOnNavigate();
        };
    }, [navigate]);


    const handleSuggestionClick = (suggestion) => {
        debugger;
        dispatch(setSearchQuery(suggestion.name)); // Update search query
        const encodedQuery = encodeURIComponent(suggestion.name.trim()); // Encode the query
        setShowSuggestions(false); // Hide suggestions
        navigate(`/search/${encodedQuery}`); // Navigate to the search page
    }

    const handleChange = (e) => {
        dispatch(setSearchQuery(e.target.value));
    }

    const handleSearch = (e) => {
        debugger;
        if (e.key === 'Enter' && searchQuery.trim()) {
            const encodedQuery = encodeURIComponent(searchQuery.trim());
            navigate(`/search/${encodedQuery}`);
            setShowSuggestions(false);
        }
    };

    const handleButtonClick = () => {
        debugger;
        if (searchQuery.trim()) {
            const encodedQuery = encodeURIComponent(searchQuery);
            navigate(`/search/${encodedQuery}`);
            setShowSuggestions(false);
        }
    };

    return (
        <div
            className="flex-1 max-w-2xl mx-8 mt-4 sm:mt-0 w-full sm:w-auto"
            ref={searchRef}
        >
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    placeholder="Bạn tìm gì..."
                    onChange={handleChange}
                    onKeyDown={handleSearch}
                    onFocus={() => setShowSuggestions(true)}
                    className="w-full px-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:border-sky-300"
                />
                <button
                    onClick={handleButtonClick} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <SearchOutlined style={{ fontSize: '24px' }} />
                </button>

                {/* Suggestions Dropdown */}
                {showSuggestions && suggestions && suggestions.length > 0 && (
                    <ul className="absolute w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-md overflow-auto z-10">    
                        {suggestions.map((suggestion, index) => (
                            <li
                                key={index}
                                onClick={() => handleSuggestionClick(suggestion)}
                                className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                            >
                                {suggestion.name}
                            </li>
                        ))}
                    </ul>
                )}

                {/* Error Message */}
                {status === 'failed' && (
                    <div className="absolute w-full mt-2 bg-white border border-red-500 rounded-lg shadow-md overflow-auto z-10">
                        <div className="px-4 py-2 text-red-500">
                            {error}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Search;