import { useSelector } from 'react-redux';
import { Settings } from 'lucide-react';
import { selectAuth } from '../../redux/reducers/user/authReducer';
import { Notifications } from '../../components/admin/Notifications';

export const Header = () => {
    const { user, isAuthenticated } = useSelector(selectAuth);

    if (!isAuthenticated) {
        return null; // Render nothing if the user is not authenticated
    }

    return (
        <div className="bg-white p-4 shadow">
            <div className="flex justify-end items-center space-x-4">
                <Settings className="w-6 h-6 text-gray-500" />
                <Notifications />
                <div className="flex items-center space-x-2">
                    <span>{user?.username || 'Anonymous'}</span>
                </div>
            </div>
        </div>
    );
};
