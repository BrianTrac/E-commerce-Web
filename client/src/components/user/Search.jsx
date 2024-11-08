import { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const Search = ({ searchQuery, setSearchQuery }) => {

//   const [searchQuery, setSearchQuery] = useState(""); 
    const navigate = useNavigate(); 

    const handleChange = (e) => {
        setSearchQuery(e.target.value);
    }

    const handleSearch = (e) => {
        if (e.key === 'Enter' && searchQuery.trim()) {
            navigate(`/search/${searchQuery}`);
        }
    };

    const handleButtonClick = () => {
        if (searchQuery.trim()) {
            navigate(`/search/${searchQuery}`);
        }
    };

    return (
        <div className="flex-1 max-w-2xl mx-8 mt-4 sm:mt-0 w-full sm:w-auto">
            <div className="relative">
                <input
                    type="text"
                    value={searchQuery}
                    placeholder="Bạn tìm gì..."
                    onChange={handleChange}
                    onKeyDown={handleSearch}
                    className="w-full px-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:border-sky-300"
                />
                <button
                    onClick={handleButtonClick} 
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                    <SearchOutlined style={{ fontSize: '24px' }} />
                </button>
            </div>
        </div>
    );
}

export default Search;