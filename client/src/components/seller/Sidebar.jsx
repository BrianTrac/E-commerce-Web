import React from "react";
import { Link } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const Sidebar = () => {
    return (
        <div className="w-64 bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6 fixed top-0 left-0 h-full shadow-lg">
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold tracking-wider">Seller Panel</h1>
            </div>

            <nav>
                <ul className="space-y-4">
                    <li>
                        <Link
                            to="/seller/dashboard"
                            className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                        >
                            <span className="flex-grow">Dashboard</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/seller/product-management"
                            className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                        >
                            <span className="flex-grow">Product Management</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/seller/order"
                            className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                        >
                            <span className="flex-grow">Orders</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/seller/voucher"
                            className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                        >
                            <span className="flex-grow">Vouchers</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/seller/info"
                            className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                        >
                            <span className="flex-grow">Account Info</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
};

export default Sidebar;