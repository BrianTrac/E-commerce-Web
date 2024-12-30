import React, { useEffect, useState } from 'react';
import { ref, onValue } from 'firebase/database';
import { database } from '../../utils/firebase';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);

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
        <div>
            <h2>Thông báo</h2>
            <ul>
                {notifications.map((notif, index) => (
                    <li key={index}>
                        {notif.message} (Thời gian: {new Date(notif.timestamp).toLocaleString()})
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Notifications;
