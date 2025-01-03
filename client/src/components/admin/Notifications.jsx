import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { ref, onValue, set } from 'firebase/database';
import { database } from '../../utils/firebase';

export const Notifications = () => {
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    useEffect(() => {
        const notificationsRef = ref(database, 'notifications/');
        const unsubscribe = onValue(
            notificationsRef,
            (snapshot) => {
                const data = snapshot.val();
                if (!data) {
                    setNotifications([]);
                    return;
                }

                // Convert to array while preserving keys as id
                const loadedNotifications = Object.entries(data).map(([key, value]) => ({
                    ...value,
                    id: key
                }));

                // Filter unread notifications and sort by timestamp
                const filteredNotifications = loadedNotifications
                    .filter(notif => !notif.isRead)
                    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

                setNotifications(filteredNotifications);
            },
            (error) => {
                console.error("Failed to load notifications:", error);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleNotificationClick = (notif) => async () => {
        try {
            const storeId = notif.sellerId;

            // Update in Firebase
            const notifRef = ref(database, `notifications/${notif.id}`);
            await set(notifRef, {
                ...notif,
                isRead: true
            });

            // Navigate after successful update
            navigate(`/admin/seller-management/${storeId}/products`);

        } catch (error) {
            console.error("Error marking notification as read:", error);
        }
    };

    return (
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
                    <ul
                        className="divide-y divide-gray-200 max-h-60 overflow-y-auto"
                        style={{ maxHeight: '240px' }}
                    >
                        {notifications.map((notif, index) => (
                            <li key={notif.id} className="p-2 hover:bg-gray-100 cursor-pointer" onClick={handleNotificationClick(notif)}>
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
    );
};