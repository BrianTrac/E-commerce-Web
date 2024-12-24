import React from "react";
import { Link, Outlet } from "react-router-dom";
import {
    ChevronDown,
    Bell,
    Settings,
} from 'lucide-react';

const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <div className="w-64 bg-[#1a2234] text-white p-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold">Mofi</h1>
                </div>

                <nav>
                    <div className="space-y-2">
                        <Link to="/admin/dashboards" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                            <span>Dashboards</span>
                            <ChevronDown className="w-4 h-4" />
                        </Link>
                        <Link to="/admin/role-management" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                            <span>Role Management</span>
                            <ChevronDown className="w-4 h-4" />
                        </Link>
                        <Link to="/admin/user-management" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                            <span>User Management</span>
                            <ChevronDown className="w-4 h-4" />
                        </Link>
                        <Link to="/admin/seller-management" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                            <span>Seller Management</span>
                            <ChevronDown className="w-4 h-4" />
                        </Link>
                    </div>
                </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
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

                {/* Page Content */}
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;