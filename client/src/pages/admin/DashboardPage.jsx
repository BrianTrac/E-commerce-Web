import React from "react";
import { Link } from "react-router-dom";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { BarChart, Bar } from 'recharts';
import {
    ShoppingCart,
    DollarSign,
    Calendar,
    CreditCard,
    ChevronDown,
    MoreVertical,
    Bell,
    Settings,
} from 'lucide-react';

const Admin = () => {
    // Sample data for charts
    const lineChartData = [
        { name: 'Jan', value: 100 },
        { name: 'Feb', value: 120 },
        { name: 'Mar', value: 90 },
        { name: 'Apr', value: 140 },
        { name: 'May', value: 110 },
        { name: 'Jun', value: 130 },
    ];

    const salesData = [
        { month: 'Jan', min: 150, max: 400 },
        { month: 'Feb', min: 200, max: 450 },
        { month: 'Mar', min: 180, max: 420 },
        { month: 'Apr', min: 220, max: 480 },
        { month: 'May', min: 250, max: 500 },
        { month: 'Jun', min: 280, max: 520 },
        { month: 'Jul', min: 300, max: 550 },
        { month: 'Aug', min: 320, max: 580 },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 p-8">
                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h2 className="text-xl font-semibold">Dashboards</h2>
                    <div className="flex items-center space-x-4">
                        <Settings className="w-6 h-6 text-gray-500" />
                        <Bell className="w-6 h-6 text-gray-500" />
                        <div className="flex items-center space-x-2">
                            <img src="/api/placeholder/32/32" alt="User" className="w-8 h-8 rounded-full" />
                            <span>John admin</span>
                            <ChevronDown className="w-4 h-4" />
                        </div>
                    </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-purple-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">12,463</h3>
                        <p className="text-sm text-gray-500">Compared to Jan 2024</p>
                        <div className="mt-4">
                            <LineChart width={200} height={60} data={lineChartData}>
                                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <ShoppingCart className="w-6 h-6 text-blue-600" />
                            </div>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">78,596</h3>
                        <p className="text-sm text-gray-500">Compared to Aug 2024</p>
                        <div className="mt-4">
                            <LineChart width={200} height={60} data={lineChartData}>
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-orange-100 rounded-full">
                                <Calendar className="w-6 h-6 text-orange-600" />
                            </div>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">95,789</h3>
                        <p className="text-sm text-gray-500">Compared to May 2024</p>
                        <div className="mt-4">
                            <LineChart width={200} height={60} data={lineChartData}>
                                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <div className="p-2 bg-pink-100 rounded-full">
                                <CreditCard className="w-6 h-6 text-pink-600" />
                            </div>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <h3 className="text-2xl font-bold mb-1">41,954</h3>
                        <p className="text-sm text-gray-500">Compared to July 2024</p>
                        <div className="mt-4">
                            <LineChart width={200} height={60} data={lineChartData}>
                                <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                    </div>
                </div>

                {/* Recent Orders and Sales Overview */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    {/* Recent Orders */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Recent Orders</h3>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left">
                                        <th className="pb-4">Recent Orders</th>
                                        <th className="pb-4">Order Date</th>
                                        <th className="pb-4">Price</th>
                                        <th className="pb-4">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="py-2">
                                            <div className="flex items-center space-x-2">
                                                <img src="/api/placeholder/40/40" alt="Product" className="w-10 h-10 rounded" />
                                                <span>Decorative Plants</span>
                                            </div>
                                        </td>
                                        <td className="py-2">20 Sep - 03:00AM</td>
                                        <td className="py-2">$657.30</td>
                                        <td className="py-2">
                                            <span className="px-2 py-1 bg-green-100 text-green-600 rounded">Succeed</span>
                                        </td>
                                    </tr>
                                    {/* Add more rows as needed */}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Sales Overview */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Sales Overview</h3>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <BarChart width={500} height={300} data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="max" fill="#3b82f6" />
                            <Bar dataKey="min" fill="#93c5fd" />
                        </BarChart>
                    </div>
                </div>

                {/* Recent Customers and Top Sellers */}
                <div className="grid grid-cols-2 gap-6">
                    {/* Recent Customers */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Recent Customers</h3>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="space-y-4">
                            {/* Customer items */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3">
                                    <img src="/api/placeholder/40/40" alt="Customer" className="w-10 h-10 rounded-full" />
                                    <div>
                                        <p className="font-medium">Junsung Park</p>
                                        <p className="text-sm text-gray-500">ID #32449</p>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-green-100 text-green-600 rounded">Paid</span>
                            </div>
                            {/* Add more customer items */}
                        </div>
                    </div>

                    {/* Top Sellers */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Top Seller Of The Month</h3>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <table className="w-full">
                            <thead>
                                <tr className="text-left">
                                    <th className="pb-4">Seller Name</th>
                                    <th className="pb-4">Product</th>
                                    <th className="pb-4">Sold</th>
                                    <th className="pb-4">Price</th>
                                    <th className="pb-4">Earnings</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className="py-2">
                                        <div className="flex items-center space-x-2">
                                            <img src="/api/placeholder/32/32" alt="Seller" className="w-8 h-8 rounded-full" />
                                            <span>Gary Waters</span>
                                        </div>
                                    </td>
                                    <td className="py-2">Clothes</td>
                                    <td className="py-2">650</td>
                                    <td className="py-2">$37.50</td>
                                    <td className="py-2">$24,375</td>
                                </tr>
                                {/* Add more rows as needed */}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;