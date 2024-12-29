import {
    ChevronDown,
    Bell,
    Settings,
} from 'lucide-react';

export const Header = () => {
    return (
        <div className="bg-white p-4 shadow">
            <div className="flex justify-end items-center space-x-4">
                <Settings className="w-6 h-6 text-gray-500" />
                <Bell className="w-6 h-6 text-gray-500" />
                <div className="flex items-center space-x-2">
                    <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full" />
                    <span>John admin</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
        </div>
    )
};