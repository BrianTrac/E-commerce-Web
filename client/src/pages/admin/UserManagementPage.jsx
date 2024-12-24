import React, { useState } from 'react';
import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Filter,
    Download,
    Upload
} from 'lucide-react';

const UserManagement = () => {
    // Sample data - replace with your actual data
    const [users] = useState([
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 234-567-8900",
            status: "Active",
            joinDate: "2024-03-10",
            totalPurchases: 150
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+1 234-567-8901",
            status: "Inactive",
            joinDate: "2024-04-20",
            totalPurchases: 90
        },
        // Add more sample data as needed
    ]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">User Management</h1>
                <p className="text-gray-600">Manage and monitor all users on your platform</p>
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

            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User Info</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Join Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total Purchases</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <img
                                            src="/api/placeholder/40/40"
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                            <div className="text-sm text-gray-500">{user.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-sm rounded-full ${user.status === 'Active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.joinDate}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.totalPurchases}</td>
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
                        Showing 1 to 10 of 20 results
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 border rounded hover:bg-gray-50">Previous</button>
                        <button className="px-4 py-2 border rounded bg-blue-600 text-white">1</button>
                        <button className="px-4 py-2 border rounded hover:bg-gray-50">2</button>
                        <button className="px-4 py-2 border rounded hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
