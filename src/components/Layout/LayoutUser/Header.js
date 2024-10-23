import React, { useEffect, useState } from 'react';
import { SearchOutlined, UserOutlined, ShoppingCartOutlined, BellOutlined } from '@ant-design/icons';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'; 
import logo from "../../../images/logo.png";

function Header() {
  const isLogin = false;
  const [searchQuery, setSearchQuery] = useState(""); 
  const navigate = useNavigate(); 
  const { keyword} = useParams();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    if (keyword) { // Chỉ thực hiện khi có keyword
      if (searchParams.get('type') === 'category') {
        setSearchQuery(`Tìm trong ${keyword}`);
      } else {
        setSearchQuery(keyword);
      }
    }
  }, [keyword, searchParams]);


  const handleChange = (e) => {
    setSearchQuery(e.target.value);
  }

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchQuery.trim()) {
      navigate(`/search/${searchQuery}`);
    }
  };

  const handleClickLogo = () => {
    setSearchQuery("");
    navigate('/');
  }

  return (
    <>
      <header className="w-full bg-sky-100 px-4 py-3 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
          {/* Wrapper for logo and text */}
          <div className="flex flex-col items-center sm:items-start">
            <span className="font-light text-gray-500 -mt-3 sm:ml-16 text-xs ">Kênh người bán</span>
            
            {/* Logo */}
            <div className="w-12 h-12">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-full object-cover hover:cursor-pointer"
                onClick={handleClickLogo} // Redirect to homepage on logo click
              />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-8 mt-4 sm:mt-0 w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Bạn tìm gì..."
                value={searchQuery} 
                onChange={handleChange}
                onKeyDown={handleSearch}
                className="w-full px-4 py-2 rounded-full bg-white border border-gray-200 focus:outline-none focus:border-sky-300"
              />
              <button
                onClick={handleSearch} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <SearchOutlined style={{ fontSize: '24px' }} />
              </button>
            </div>
          </div>

          {/* Conditional Rendering for User Login */}
          {isLogin ? (
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <div className='relative'>
                <button className="flex items-center text-gray-600 hover:text-gray-800">
                  <ShoppingCartOutlined style={{ fontSize: '20px', marginRight: '12px' }} />
                  Giỏ hàng
                </button>
                <span className="absolute -top-2 left-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                </span>
              </div>
              <div className="relative">
                <BellOutlined style={{ fontSize: '20px', marginRight: '6px' }} />
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  2
                </span>
              </div> 
              <button className="flex items-center text-gray-600 hover:text-gray-800">
                <UserOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
                Khanhpro
              </button>
            </div>
          ) : (
            <div className="flex items-center space-x-6 mt-4 sm:mt-0">
              <div className='relative'>
                <button className="flex items-center text-gray-600 hover:text-gray-800">
                  <ShoppingCartOutlined style={{ fontSize: '20px', marginRight: '12px' }} />
                  Giỏ hàng
                </button>
                <span className="absolute -top-2 left-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    2
                </span>
              </div>
              <button className="flex items-center text-gray-600 hover:text-gray-800">
                <UserOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
                Đăng nhập
              </button>
            </div>
          )}
        </div>
      </header>
    </>
  );
}

export default Header;
