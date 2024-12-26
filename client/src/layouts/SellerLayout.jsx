import React from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/seller/Sidebar";
import Header from "../components/seller/Header";
import Footer from "../components/seller/Footer";

const SellerLayout = () => {
    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Sidebar */}
            <Sidebar />

            {/* Main Content */}
            <div className="flex-1">
                {/* Header */}
                <Header />

                {/* Page Content */}
                <div className="p-8">
                    <Outlet />
                </div>

                {/* Footer */}
                <Footer />
            </div>
        </div>
    );
};

export default SellerLayout;