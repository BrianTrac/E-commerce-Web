import React from "react";
import { Link, Outlet } from "react-router-dom";
import { Sidebar } from "../components/admin/Sidebar";
import { Header } from "../components/admin/Header";

const AdminLayout = () => {
    return (
        <div className="flex h-screen bg-gray-100 overflow-hidden">
            {/* Fixed Sidebar */}
            <aside className="fixed inset-y-0 left-0 h-screen">
                <Sidebar />
            </aside>

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col ml-64">
                {/* Fixed Header */}
                <div className="fixed top-0 right-0 left-64 z-10 bg-white">
                    <Header />
                </div>

                {/* Scrollable Content Area */}
                <main className="flex-1 overflow-y-auto pt-16">
                    <div className="p-8">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;