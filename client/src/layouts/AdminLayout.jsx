import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Sidebar } from "../components/admin/Sidebar";
import { Header } from "../components/admin/Header";


const AdminLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1">
                <Header />

                {/* Page Content */}
                <div className="p-8">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default AdminLayout;