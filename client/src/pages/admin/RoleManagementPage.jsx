import React, { useState } from 'react';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Filter,
    Download,
    Upload,
    Shield,
} from 'lucide-react';

const RoleManagement = () => {
    // Sample data for roles/shop owners
    const [owners] = useState([
        {
            id: 1,
            name: "John Smith",
            email: "john.smith@example.com",
            phone: "+1 234-567-8902",
            role: "Super Admin",
            permissions: ["all"],
            stores: 3,
            status: "Active",
            lastLogin: "2024-03-15",
            joinDate: "2023-12-10"
        },
        {
            id: 2,
            name: "Emma Wilson",
            email: "emma.w@example.com",
            phone: "+1 234-567-8903",
            role: "Store Admin",
            permissions: ["manage_inventory", "manage_staff", "view_reports"],
            stores: 1,
            status: "Active",
            lastLogin: "2024-03-14",
            joinDate: "2024-01-05"
        }
    ]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">Role Management</h1>
                <p className="text-gray-600">Manage system roles and shop owner permissions</p>
            </div>

            {/* Action Bar */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex justify-between items-center">
                    <div className="flex items-center space-x-4">
                        {/* Search */}
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:border-blue-500"
                            />
                            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
                        </div>
                        {/* Filter Button */}
                        <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                            <Filter className="w-4 h-4" />
                            <span>Filters</span>
                        </button>
                    </div>

                    <div className="flex items-center space-x-4">
                        {/* Export/Import */}
                        <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                            <Download className="w-4 h-4" />
                            <span>Export</span>
                        </button>
                        <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                            <Upload className="w-4 h-4" />
                            <span>Import</span>
                        </button>
                        {/* Add New */}
                        <button className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                            <Plus className="w-4 h-4" />
                            <span>Add New User</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Roles Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User Info</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Role</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Stores</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Last Login</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Join Date</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {owners.map((owner) => (
                            <tr key={owner.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <img
                                            src="/api/placeholder/40/40"
                                            alt={owner.name}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">{owner.name}</div>
                                            <div className="text-sm text-gray-500">{owner.email}</div>
                                            <div className="text-sm text-gray-500">{owner.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <Shield className="w-4 h-4 mr-2 text-blue-600" />
                                        <span className="text-sm font-medium text-gray-900">{owner.role}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{owner.stores}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-sm rounded-full ${owner.status === 'Active'
                                            ? 'bg-green-100 text-green-800'
                                            : 'bg-yellow-100 text-yellow-800'
                                        }`}>
                                        {owner.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{owner.lastLogin}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{owner.joinDate}</td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <button className="text-gray-400 hover:text-gray-500">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-500">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button className="text-gray-400 hover:text-red-500">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        Showing 1 to 10 of 25 results
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 border rounded hover:bg-gray-50">Previous</button>
                        <button className="px-4 py-2 border rounded bg-blue-600 text-white">1</button>
                        <button className="px-4 py-2 border rounded hover:bg-gray-50">2</button>
                        <button className="px-4 py-2 border rounded hover:bg-gray-50">3</button>
                        <button className="px-4 py-2 border rounded hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RoleManagement;