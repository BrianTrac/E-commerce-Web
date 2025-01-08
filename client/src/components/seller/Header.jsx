import React, { useState, useEffect, useRef } from "react";
import { ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectAuth } from "../../redux/reducers/user/authReducer"; // Importing the selector for user auth
import { logout } from "../../redux/actions/user/authAction";
import {
    User,
} from 'lucide-react';
import useAxiosPrivate  from '../../hooks/useAxiosPrivate';

const Header = () => {
    const navigate = useNavigate();
    const { user, isAuthenticated } = useSelector(selectAuth); // Getting user and authentication status from Redux
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate(); // Axios instance for private routes

    // State to handle dropdown visibility
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef(null); // Create a reference for dropdown
    const userMenuRef = useRef(null); // Create a reference for the username section

    // Handler for logout
    const handleLogout = () => {
        dispatch(logout({axiosPrivate})); // Assuming you have a logout action
        navigate("/auth/login?type=seller"); // Navigate to login page after logout
    };

    // Close the dropdown after clicking an option
    const handleMenuClick = (action) => {
        if (action === "logout") {
            handleLogout();
        } else if (action === "profile") {
            navigate("/seller/info"); // Navigate to profile page
        }
        setIsDropdownOpen(false); // Close the dropdown after the action
    };

    // Toggle dropdown visibility
    const toggleDropdown = () => {
        setIsDropdownOpen((prev) => !prev);
    };

    // Close the dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) && 
                userMenuRef.current && !userMenuRef.current.contains(event.target)) {
                setIsDropdownOpen(false); // Close the dropdown
            }
        };

        document.addEventListener("click", handleClickOutside);
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-white p-4 shadow">
            <div className="flex justify-end items-center">
                {/* Conditional rendering based on authentication status */}
                <div className="flex items-center space-x-2 relative" ref={userMenuRef}>
                    {isAuthenticated ? (
                        <>
                            <span 
                                className="p-2 bg-gray-100 rounded-full cursor-pointer" 
                                onClick={toggleDropdown} 
                            >
                                <User className="w-6 h-6 text-gray-600" />
                            </span>
                            <span 
                                onClick={toggleDropdown} 
                                className="cursor-pointer flex items-center space-x-2"
                            >
                                <span>{user.username}</span>
                                <ChevronDown className="w-4 h-4" />
                            </span>

                            {/* Dropdown Menu */}
                            {isDropdownOpen && (
                                <div 
                                    ref={dropdownRef} 
                                    className="absolute right-0 top-4 mt-2 w-40 bg-white border rounded shadow-lg z-50"
                                >
                                    <button 
                                        onClick={() => handleMenuClick("profile")} 
                                        className="w-full text-left p-2 text-sm hover:bg-gray-100"
                                    >
                                        Profile
                                    </button>
                                    <button 
                                        onClick={() => handleMenuClick("logout")} 
                                        className="w-full text-left p-2 text-sm text-red-500 hover:bg-gray-100"
                                    >
                                        Logout
                                    </button>
                                </div>
                            )}
                        </>
                    ) : (
                        <>
                            <span>Guest</span>
                            <button onClick={() => navigate("/auth/login")} className="text-sm text-blue-500">Login</button>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Header;
