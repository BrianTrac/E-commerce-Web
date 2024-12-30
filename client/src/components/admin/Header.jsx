import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Bell, Settings } from 'lucide-react';
import { selectAuth } from '../../redux/reducers/user/authReducer';
import { ref, onValue } from 'firebase/database';
import { database } from '../../utils/firebase';

export const Header = () => {
    const { user, isAuthenticated } = useSelector(selectAuth);
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const notificationsRef = ref(database, 'notifications/');
        const unsubscribe = onValue(
            notificationsRef,
            (snapshot) => {
                const data = snapshot.val();
                const loadedNotifications = data ? Object.values(data) : [];
                setNotifications(loadedNotifications);
            },
            (error) => {
                console.error("Failed to load notifications:", error);
            }
        );

        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-white p-4 shadow">
            <div className="flex justify-end items-center space-x-4">
                <Settings className="w-6 h-6 text-gray-500" />

                <div className="relative">
                    <Bell
                        className="w-6 h-6 text-gray-500 cursor-pointer"
                        onClick={() => setShowDropdown(!showDropdown)}
                    />
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                            {notifications.length}
                        </span>
                    )}
                    {showDropdown && (
                        <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-md">
                            <ul className="divide-y divide-gray-200">
                                {notifications.slice(-5).map((notif, index) => (
                                    <li key={index} className="p-2 hover:bg-gray-100">
                                        <p className="text-sm text-gray-700">{notif.message}</p>
                                        <p className="text-xs text-gray-500">
                                            {new Date(notif.timestamp).toLocaleString()}
                                        </p>
                                    </li>
                                ))}
                                {notifications.length === 0 && (
                                    <li className="p-2 text-center text-sm text-gray-500">
                                        No notifications
                                    </li>
                                )}
                            </ul>
                        </div>
                    )}
                </div>

                <div className="flex items-center space-x-2">
                    <span>{user?.username || 'Anonymous'}</span>
                </div>
            </div>
        </div>
    );
};