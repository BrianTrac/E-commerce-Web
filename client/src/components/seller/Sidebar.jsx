import React from "react";
import { Link } from "react-router-dom";
import { ChevronDown } from "lucide-react";

const Sidebar = () => {
    return (
        <div className="w-64 bg-[#1a2234] text-white p-4">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Seller Page</h1>
            </div>

            <nav>
                <div className="space-y-2">
                    <Link to="/seller/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                        <span>Dashboard</span>
                        <ChevronDown className="w-4 h-4" />
                    </Link>
                    <Link to="/seller/product-management" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                        <span>Product Management</span>
                        <ChevronDown className="w-4 h-4" />
                    </Link>
                    <Link to="/seller/order" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                        <span>Order</span>
                        <ChevronDown className="w-4 h-4" />
                    </Link>
                    <Link to="/seller/voucher" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                        <span>Voucher</span>
                        <ChevronDown className="w-4 h-4" />
                    </Link>
                    <Link to="/seller/info" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                        <span>Info</span>
                        <ChevronDown className="w-4 h-4" />
                    </Link>
                </div>
            </nav>
        </div>
    );
};

export default Sidebar;