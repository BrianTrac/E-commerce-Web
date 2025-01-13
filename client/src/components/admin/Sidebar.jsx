import { ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export const Sidebar = () => {
    return (
        <div className="w-64 bg-[#1a2234] text-white p-4 h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Trang Admin</h1>
            </div>
            <nav>
                <ul className="space-y-4">
                    <li>
                        <Link
                            to="/admin/dashboards"
                            className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                        >
                            <span className="flex-grow">Tổng quan</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/user-management"
                            className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                        >
                            <span className="flex-grow">Quản trị người dùng</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/seller-management"
                            className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                        >
                            <span className="flex-grow">Quản trị shop</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </li>
                    <li>
                        <Link
                            to="/admin/product-management"
                            className="flex items-center p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition"
                        >
                            <span className="flex-grow">Quản trị sản phẩm</span>
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </li>
                </ul>
            </nav>
        </div>
    )
}