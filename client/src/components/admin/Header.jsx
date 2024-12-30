import Reac, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronDown, Bell, Settings } from 'lucide-react';
import { selectAuth } from '../../redux/reducers/user/authReducer';

export const Header = () => {
    const { user, isAuthenticated } = useSelector(selectAuth);

    return (
        <div className="bg-white p-4 shadow">
            <div className="flex justify-end items-center space-x-4">
                <Settings className="w-6 h-6 text-gray-500" />
                <Bell className="w-6 h-6 text-gray-500" />
                <div className="flex items-center space-x-2">
                    <span>{user?.username || 'Anonymous'}</span>
                </div>
            </div>
        </div>
    )
};