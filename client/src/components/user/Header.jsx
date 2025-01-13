import React, { useEffect, useState } from 'react';
import { SearchOutlined, UserOutlined, ShoppingCartOutlined, BellOutlined, LogoutOutlined, DownOutlined } from '@ant-design/icons';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { selectAuth } from '../../redux/reducers/user/authReducer';
import logo from "../../assets/logo.png";
import Search from './Search';
import { setSearchQuery } from '../../redux/reducers/user/searchReducer';
import { getCartItems } from '../../redux/services/user/cartService';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { selectCartQuantity } from '../../redux/reducers/user/cartReducer';
import { setCartQuantity } from '../../redux/reducers/user/cartReducer';
import { logout } from '../../redux/actions/user/authAction';

function Header() {

    const searchQuery = useSelector((state) => state.user.search.query);
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector(selectAuth);
    const dispatch = useDispatch();
    const cartQuantity = useSelector(selectCartQuantity);
    const axiosPrivate = useAxiosPrivate();
    
    useEffect(() => {
        // Update cart quantity in the header initially and whenever the cart changes
        const fetchCartItems = async () => {
            const response = await getCartItems(axiosPrivate);
            
            if (!response.success) {
                return;
            }

            const quantity = response.cartItems.length;
            debugger;

            dispatch(setCartQuantity(quantity));
        };
        // check if user is authenticated before fetching cart items
        if (isAuthenticated && user.role.toLowerCase() === 'user') {
            debugger;
            fetchCartItems();
        //    console.log('User: ', user);
        }
    }, []);

    const handleClickLogo = () => {
        dispatch(setSearchQuery(''));
        navigate('/');
    }
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const openMenu = () => {
        setIsMenuOpen(true);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    const handleCartClick = () => {
        // check if user is authenticated
        if (!isAuthenticated) {
            return navigate('/auth/login');
        }
        navigate('/checkout/cart');
    }

    const handleLogout = async() => {
        await dispatch(logout({ axiosPrivate }));
        // Redirect to login after logout
        navigate('/auth/login');
    }

    const handleAccountInfoClick = () => {
        navigate('/account/info');
    }

    const handleOrderManagementClick = () => {
        navigate('/order-management');
    }

    return (
        <>
            <header className="w-full bg-sky-100 px-4 py-3 shadow-sm">
                <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap">
                    {/* Link click to seller login */}
                    <p className="text-gray-600 hover:text-gray-800 mr-10">
                        <Link to="/auth/login?type=seller">Kênh bán hàng</Link>
                    </p>
                           

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
                    {(isAuthenticated && user.role.toLowerCase() === 'user')? (
                        <div className="flex items-center space-x-6 mt-4 sm:mt-0">
                            <div className="relative">
                                <button
                                className="flex items-center text-gray-600 hover:text-gray-800"
                                onClick={handleCartClick}
                            >
                                    <ShoppingCartOutlined style={{ fontSize: '20px', marginRight: '12px' }} />
                                    Giỏ hàng
                                </button>
                                <span className="absolute -top-2 left-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                {cartQuantity}
                                </span>
                            </div>
                            <div className="relative">
                                <BellOutlined style={{ fontSize: '20px', marginRight: '6px' }} />
                                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    4
                                </span>
                            </div>
                            <div
                                className="relative"
                                onMouseLeave={closeMenu} // Close menu when mouse leaves the entire block
                            >
                                <button
                                    onMouseEnter={openMenu}
                                    className="flex items-center text-gray-600 hover:text-gray-800 font-semibold"
                                >
                                    <UserOutlined style={{ fontSize: '20px', marginRight: '8px' }} />
                                    {user?.username || 'Anonymous'}
                                    <DownOutlined style={{ fontSize: '14px', marginLeft: '8px' }} />
                                </button>
                                {isMenuOpen && (
                                    <div
                                        className="absolute left-0 mt-2 w-52 bg-white rounded-md shadow-lg border border-gray-200 z-10"
                                        onMouseEnter={openMenu}
                                        onMouseLeave={closeMenu}
                                        style={{ marginTop: '0', paddingTop: '8px' }} // Replace margin with padding
                                    >
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                                            onClick={handleAccountInfoClick}
                                        >
                                            Thông tin tài khoản
                                        </button>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                                            onClick={handleOrderManagementClick}
                                        >
                                            Đơn hàng của tôi
                                        </button>
                                        <button
                                            className="block w-full text-left px-4 py-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                                            onClick={handleLogout}
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
                                <button
                                className="flex items-center text-gray-600 hover:text-gray-800 mr-12"
                                onClick={handleCartClick}
                            >
                                    <ShoppingCartOutlined style={{ fontSize: '20px', marginRight: '12px' }} />
                                    Giỏ hàng
                                </button>
                                <span className="absolute -top-2 left-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                    0
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