import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Bell } from 'lucide-react';
import { ref, onValue, set, remove } from 'firebase/database';
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

                // Sort notifications: unread first, then read ones
                const sortedNotifications = loadedNotifications.sort((a, b) => {
                    if (!a.isRead && b.isRead) return -1;
                    if (a.isRead && !b.isRead) return 1;
                    return new Date(b.timestamp) - new Date(a.timestamp);
                });

                setNotifications(sortedNotifications);
            },
            (error) => {
                console.error("Failed to load notifications:", error);
            }
        );

        return () => unsubscribe();
    }, []);

    const handleNotificationClick = (notif) => {
        const storeId = notif.sellerId;

        // Update in Firebase
        const notifRef = ref(database, `notifications/${notif.id}`);
        set(notifRef, {
            ...notif,
            isRead: true
        });

        // Navigate after successful update
        navigate(`/admin/seller-management/${storeId}/products`);
    };

    const handleDeleteNotification = (notifId, event) => {
        event.stopPropagation(); // Prevent event bubbling
        try {
            // Delete notification from Firebase
            const notifRef = ref(database, `notifications/${notifId}`);
            remove(notifRef);

            // Remove from local state
            setNotifications((prevNotifications) =>
                prevNotifications.filter((notif) => notif.id !== notifId)
            );
        } catch (error) {
            console.error("Error deleting notification:", error);
        }
    };

    const unreadCount = notifications.filter((notif) => !notif.isRead).length;

    return (
        <div className="relative">
            <button
                className="relative p-1 rounded-full hover:bg-gray-100 focus:outline-none"
                onClick={() => setShowDropdown(!showDropdown)}
                aria-label="Notifications"
            >
                <Bell className="w-6 h-6 text-gray-500" />
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                        {unreadCount}
                    </span>
                )}
            </button>
            {showDropdown && (
                <div className="absolute right-0 mt-2 w-64 bg-white border border-gray-200 rounded shadow-md z-10">
                    <ul
                        className="divide-y divide-gray-200 max-h-60 overflow-y-auto"
                        style={{ maxHeight: '240px' }}
                    >
                        {notifications.length === 0 ? (
                            <li className="p-2 text-center text-sm text-gray-500">
                                No notifications
                            </li>
                        ) : (
                            notifications.map((notif) => (
                                <li
                                    key={notif.id}
                                    className="p-2 hover:bg-gray-100 cursor-pointer"
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    <div className="flex justify-between items-start">
                                        <div>
                                            {/* Bold text for unread notifications */}
                                            <p className={`text-sm ${!notif.isRead ? 'font-bold' : 'font-normal'} text-gray-700`}>
                                                {notif.message}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {new Date(notif.timestamp).toLocaleString()}
                                            </p>
                                        </div>
                                        <button
                                            className="text-red-500 hover:text-red-700 text-xs p-1"
                                            onClick={(event) => handleDeleteNotification(notif.id, event)}
                                            aria-label="Delete notification"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </li>
                            ))
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};