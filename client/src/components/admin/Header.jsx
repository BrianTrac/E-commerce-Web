import { useSelector } from 'react-redux';
import { Settings } from 'lucide-react';
import { selectAuth } from '../../redux/reducers/user/authReducer';
import { Notifications } from '../../components/admin/Notifications';
import { logout } from '../../redux/actions/user/authAction';
import { useNavigate } from 'react-router-dom';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useDispatch } from 'react-redux';
import { useState } from 'react';
import { DownOutlined, UserOutlined } from '@ant-design/icons';

export const Header = () => {
    const { user, isAuthenticated } = useSelector(selectAuth);
    const axiosPrivate = useAxiosPrivate();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (!isAuthenticated) {
        return null; // Render nothing if the user is not authenticated
    }

    const handleLogout = () => {
        dispatch(logout({ axiosPrivate })); // Assuming you have a logout action
        navigate("/auth/login"); // Navigate to login page after logout
    };

    const openMenu = () => {
        setIsMenuOpen(true);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <div className="bg-white p-4 shadow">
            <div className="flex justify-end items-center space-x-4">
                <Settings className="w-6 h-6 text-gray-500" />
                <Notifications />
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
                                onClick={handleLogout}
                            >
                                Logout
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
