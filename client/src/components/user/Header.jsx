import React, { useEffect, useState } from 'react';
import { SearchOutlined, UserOutlined, ShoppingCartOutlined, BellOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '../../redux/reducers/user/authReducer';
import logo from "../../assets/logo.png";
import Search from './Search';
import { setSearchQuery } from '../../redux/reducers/user/searchReducer';


function Header() {

    const searchQuery = useSelector((state) => state.user.search.query);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector(selectAuth);
    const dispatch = useDispatch();


    const handleClickLogo = () => {
        dispatch(setSearchQuery(''));
        navigate('/');
    }
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <header className="w-full bg-sky-100 px-4 py-3 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
                    {/* Wrapper for logo and text */}
                    <div className="flex flex-col items-center sm:items-start">
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
                    <Search />

                    {/* Conditional Rendering for User Login */}
                    {isAuthenticated ? (
                        <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                            <div className="relative">
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
                            <div className="relative">
                                <button
                                    onClick={toggleMenu}
                                    className="flex items-center text-gray-600 hover:text-gray-800 font-semibold"
                                >
                                    <UserOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
                                    {user?.username || 'Anonymous'}
                                    <DownOutlined style={{ fontSize: '14px', marginLeft: '8px' }} />
                                </button>
                                {isMenuOpen && (
                                    <div
                                        className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                                        onMouseLeave={closeMenu}
                                    >
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                                            // onClick={handleLogout}
                                        >
                                            Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                            <div className='relative'>
                                <button className="flex items-center text-gray-600 hover:text-gray-800 mr-12">
                                    <ShoppingCartOutlined style={{ fontSize: '20px', marginRight: '12px' }} />
                                    Giỏ hàng
                                </button>
                                <span className="absolute -top-2 left-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    2
                                </span>
                            </div>

                            <button
                                className="flex items-center text-gray-600 hover:text-gray-800"
                                onClick={() => navigate('/auth/register')}
                            >
                                <UserOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
                                Đăng ký
                            </button>
                            <div className="h-6 border-l border-gray-300"></div>
                            <button
                                className="flex items-center text-gray-600 hover:text-gray-800"
                                onClick={() => navigate('/auth/login')}
                            >
                                Đăng nhập
                            </button>
                        </div>
                    )}
                </div>
            </header>
        </>
    );
}

export default Header;