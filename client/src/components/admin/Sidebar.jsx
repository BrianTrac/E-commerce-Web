import { ChevronDown } from 'lucide-react';
import { Link } from "react-router-dom";

export const Sidebar = () => {
    return (
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
    )
}

