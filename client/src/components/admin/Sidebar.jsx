import { ChevronDown } from 'lucide-react';
import { Link } from "react-router-dom";

export const Sidebar = () => {
    return (
        <div className="w-64 bg-[#1a2234] text-white p-4 h-full">
            <div className="mb-8">
                <h1 className="text-2xl font-bold">Trang Admin</h1>
            </div>

            <nav>
                <div className="space-y-2">
                    <Link to="/admin/dashboards" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                        <span>Trang chủ</span>
                    </Link>
                    <Link to="/admin/user-management" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                        <span>Quản lý người dùng</span>
                    </Link>
                    <Link to="/admin/seller-management" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                        <span>Quản lý shop</span>
                    </Link>
                    <Link to="/admin/product-management" className="flex items-center space-x-2 p-2 rounded hover:bg-blue-600">
                        <span>Quản lý sản phẩm</span>
                    </Link>
                </div>
            </nav>
        </div>
    )
}