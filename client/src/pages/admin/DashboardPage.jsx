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

    const recentOrders = [
        {
            image: 'https://via.placeholder.com/40',
            name: 'Decorative Plants',
            date: '20 Sep - 03:00AM',
            price: '$657.30',
            status: 'Succeed'
        }
    ]

    const recentCustomers = [
        {
            image: 'https://via.placeholder.com/40',
            name: 'Junsung Park',
            id: '#32449',
            status: 'Paid'
        }
    ]

    const topSellers = [
        {
            image: 'https://via.placeholder.com/40',
            name: 'Gary Waters',
            product: 'Clothes',
            sold: 650,
            price: '$37.50',
            earnings: '$24,375'
        }
    ]

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
                                    {recentOrders.map((order, index) => (
                                        <tr key={index}>
                                            <td className="py-2">
                                                <div className="flex items-center space-x-2">
                                                    <img src={order.image} alt="Product" className="w-10 h-10 rounded" />
                                                    <span>{order.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-2">{order.date}</td>
                                            <td className="py-2">{order.price}</td>
                                            <td className="py-2">
                                                <span className="px-2 py-1 bg-green-100 text-green-600 rounded">{order.status}</span>
                                            </td>
                                        </tr>
                                    ))}
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
                            {recentCustomers.map((customer, index) => (
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3">
                                        <img src={customer.image} alt="Customer" className="w-10 h-10 rounded-full" />
                                        <div>
                                            <p className="font-medium">{customer.name}</p>
                                            <p className="text-sm text-gray-500">ID {customer.id}</p>
                                        </div>
                                    </div>
                                    <span className="px-2 py-1 bg-green-100 text-green-600 rounded">{customer.status}</span>
                                </div>
                            ))}
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
                                {topSellers.map((seller, index) => (
                                    <tr>
                                        <td className="py-2">
                                            <div className="flex items-center space-x-2">
                                                <img src={seller.image} alt="Seller" className="w-8 h-8 rounded-full" />
                                                <span>Gary Waters</span>
                                            </div>
                                        </td>
                                        <td className="py-2">{seller.product}</td>
                                        <td className="py-2">{seller.sold}</td>
                                        <td className="py-2">{seller.price}</td>
                                        <td className="py-2">{seller.earnings}</td>
                                    </tr>
                                ))}

                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Admin;