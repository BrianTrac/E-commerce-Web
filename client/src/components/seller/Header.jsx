import React from "react";
import { Bell, Settings, ChevronDown } from "lucide-react";

const Header = () => {
    return (
        <div className="bg-white p-4 shadow">
            <div className="flex justify-end items-center space-x-4">
                <Settings className="w-6 h-6 text-gray-500" />
                <Bell className="w-6 h-6 text-gray-500" />
                <div className="flex items-center space-x-2">
                    <img src="" alt="User" className="w-8 h-8 rounded-full" />
                    <span>Seller</span>
                    <ChevronDown className="w-4 h-4" />
                </div>
            </div>
        </div>
    );
};

export default Header;