import React, { useEffect, useState } from 'react';
import { Table, Button, Tooltip, Typography, Tag } from 'antd';
import { EyeOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip as TooltipRecharts, ResponsiveContainer } from 'recharts';
import { getTopSellingProductInDashboard, getTotalFollowers, getTotalProducts, getTotalRevenue, getTotalReviews } from '../../service/seller/productApi';
import { getPotentialCustomer, getRecentOrders } from '../../service/seller/orderApi';
import {
    DollarSign,
    Users,
    CreditCard,
    MoreVertical,
    Package,
} from 'lucide-react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
const { Text } = Typography;

const SellerDashboard = () => {  
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
        { month: 'Sep', min: 350, max: 600 },
        { month: 'Oct', min: 380, max: 620 },
        { month: 'Nov', min: 400, max: 650 },
        { month: 'Dec', min: 420, max: 680 },
    ];

    const navigate = useNavigate();
    const [topSellingProducts, setTopSellingProducts] = useState([]);
    const [pagination, setPagination] = useState({ current: 1, pageSize: 5, total: 0 });
    const [loading, setLoading] = useState(true);
    const [totalRevenue, setTotalRevenue] = useState(0);
    const [totalProducts, setTotalProducts] = useState(0);
    const [totalFollowers, setTotalFollowers] = useState(0);
    const [totalReviews, setTotalReviews] = useState(0);
    const [potentialCustomers, setPotentialCustomers] = useState([]);
    const [recentOrders, setRecentOrders] = useState([]);
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        loadTopSellingProducts();
    }, [pagination.current]);

    useEffect(() => {
        loadTotalRevenue();
        loadTotalProducts();
        loadTotalFollowers();
        loadTotalReviews();
        loadPotentialCustomers();
        loadRecentOrders();
    }, []);

    const loadTotalRevenue = async () => {
        try {
            const response = await getTotalRevenue(axiosPrivate);
            setTotalRevenue(response.totalRevenue);
        } catch (err) {
            console.error(err);
        }
    }

    const loadTotalProducts = async () => {
        try {
            const response = await getTotalProducts(axiosPrivate);
            setTotalProducts(response.totalProducts);
        } catch (err) {
            console.error(err);
        }
    }

    const loadTotalFollowers = async () => {
        try {
            const response = await getTotalFollowers(axiosPrivate);
            setTotalFollowers(response.totalFollowers);
        } catch (err) {
            console.error(err);
        }
    }

    const loadTotalReviews = async () => {
        try {
            const response = await getTotalReviews(axiosPrivate);
            setTotalReviews(response.totalReviews);
        } catch (err) {
            console.error(err);
        }
    }

    const loadPotentialCustomers = async () => {
        try {
            const response = await getPotentialCustomer(axiosPrivate);
            setPotentialCustomers(response.data);
        } catch (err) {
            console.error(err);
        }
    }

    const loadRecentOrders = async () => {
        try {
            const response = await getRecentOrders(axiosPrivate);
            console.log(response);
            setRecentOrders(response.orders);
        } catch (err) {
            console.error(err);
        }
    }

    const loadTopSellingProducts = async () => {
        setLoading(true);
        try {
            const response = await getTopSellingProductInDashboard(axiosPrivate, pagination.current, pagination.pageSize);

            // Giới hạn số lượng sản phẩm hiển thị tối đa
            const maxTotal = Math.min(response.totalItems, 19); // Giới hạn tối đa 20 sản phẩm

            setTopSellingProducts(response.products);
            setPagination({
                ...pagination,
                total: maxTotal, // Cập nhật tổng số sản phẩm hiển thị
            });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };


    if (loading) {
        return <div className="text-center text-xl">Loading...</div>;
    }

    const handleView = (product) => {
        navigate(`/seller/product-management/detail/${product.id}`);
    };

    const formatCurrency = (value) => {
        if (value >= 1_000_000_000) {
            return `${(value / 1_000_000_000).toFixed(1)} Tỷ`;
        } else if (value >= 1_000_000) {
            return `${(value / 1_000_000).toFixed(1)} Triệu`;
        } else {
            return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
        }
    };

    const topSellingProductsColumns = [
        {
            title: 'Image', key: 'image', width: '80px',
            render: (_, record) => (
                <img 
                    src={(Array.isArray(record.thumbnails) && record.thumbnails[0]) || ''} 
                    alt={record.name || 'No image'} 
                    className="w-10 h-10 object-cover border rounded" 
                />
            ),
        },
        { title: 'Name', dataIndex: 'name', key: 'name' },
        { title: 'Sold', dataIndex: 'quantity_sold', key: 'quantity_sold' },
        {
            title: 'Price', dataIndex: 'price', key: 'price',
            render: (price) =>
                price ? (
                    <span style={{ color: 'green' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(Number(price))}
                    </span>
                ) : (
                    <span style={{ color: 'red' }}>N/A</span>
                ),
        },
        {
            title: 'Rating', dataIndex: 'rating', key: 'rating',
            render: (rating) =>
              rating !== undefined && rating !== null ? `${parseFloat(rating).toFixed(1)} ⭐` : 'No rating',
            },
        {
            title: 'Earnings', dataIndex: 'earnings', key: 'earnings',
            render: (price) =>
                price
                    ? `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price))}`
                    : 'N/A',
        },
        {
            title: 'View detail', dataIndex: 'action', key: 'action',
            render: (_, record) => (
                <Tooltip title="View Product">
                    <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleView(record)}
                    className="text-blue-600 p-0 hover:text-blue-800"
                    />
                </Tooltip>
            )
        }
    ];

    const potentialCustomersColumns = [
        { title: 'Customer', dataIndex: 'username', key: 'username' },
        { title: 'Email', dataIndex: 'email', key: 'email' },
        { title: 'Total Spending', dataIndex: 'spending', key: 'spending',
            render: (price) =>
                price ? (
                    <span style={{ color: 'green' }}>
                        {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND', }).format(Number(price))}
                    </span>
                ) : (
                    <span style={{ color: 'red' }}>N/A</span>
                ),
        },
    ];

    const recentOrdersColumns = [
        {
            title: 'Customer', dataIndex: 'User', key: 'User',
            render: (user) => (
                <>
                    <Text strong>{user.username}</Text>
                    <br />
                    <Text type="secondary">{user.email}</Text>
                </>
            ),
        },
        {
            title: 'Total Price', dataIndex: 'total_price', key: 'total_price',
            render: (price) => <Text style={{ color: 'green' }}>{Number(price).toLocaleString()} VND</Text>,
        },
        {
            title: 'Status', dataIndex: 'status', key: 'status',
            render: (status) => {
                const color =
                    status === 'pending' 
                        ? 'orange' : status === 'processing'
                        ? 'green' : status === 'cancelled'
                        ? 'red' : 'blue';
                return <Tag color={color}>{status.toUpperCase()}</Tag>;
            },
        },
    ];

    return (
        <div className="flex min-h-screen bg-gray-100">
            {/* Main Content */}
            <div className="flex-1 p-8">
                {/* Stats Grid */}
                <div className="grid grid-cols-4 gap-6 mb-8">
                    {/* Total Revenue */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl text-gray-500 font-bold">Total Revenue</h3>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex items-center justify-start mb-4">
                            <div className="p-2 bg-purple-100 rounded-full">
                                <DollarSign className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-1 ml-4">
                                {formatCurrency(totalRevenue)}
                            </h3>
                        </div>

                        <p className="text-sm text-gray-500">Compared to Jan 2024</p>
                        <div className="mt-4">
                            <LineChart width={200} height={60} data={lineChartData}>
                                <Line type="monotone" dataKey="value" stroke="#8884d8" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                    </div>

                    {/* Total products */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl text-gray-500 font-bold ">Total Products</h3>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex items-center justify-start mb-4">
                            <div className="p-2 bg-blue-100 rounded-full">
                                <Package className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-1 ml-4">{totalProducts}</h3>
                        </div>

                        <p className="text-sm text-gray-500">Compared to Aug 2024</p>
                        <div className="mt-4">
                            <LineChart width={200} height={60} data={lineChartData}>
                                <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                    </div>

                    {/* Total Followers */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl text-gray-500 font-bold ">Total Followers</h3>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex items-center justify-start mb-4">
                            <div className="p-2 bg-orange-100 rounded-full">
                                <Users className="w-6 h-6 text-orange-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-1 ml-4">{totalFollowers}</h3>
                        </div>

                        <p className="text-sm text-gray-500">Compared to May 2024</p>
                        <div className="mt-4">
                            <LineChart width={200} height={60} data={lineChartData}>
                                <Line type="monotone" dataKey="value" stroke="#f97316" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                    </div>

                    {/* Total Reviews */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-2xl text-gray-500 font-bold ">Total Reviews</h3>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <div className="flex items-center justify-start mb-4">
                            <div className="p-2 bg-pink-100 rounded-full">
                                <CreditCard className="w-6 h-6 text-pink-600" />
                            </div>
                            <h3 className="text-2xl font-bold mb-1 ml-4">{totalReviews}</h3>
                        </div>

                        <p className="text-sm text-gray-500">Compared to July 2024</p>
                        <div className="mt-4">
                            <LineChart width={200} height={60} data={lineChartData}>
                                <Line type="monotone" dataKey="value" stroke="#ec4899" strokeWidth={2} dot={false} />
                            </LineChart>
                        </div>
                    </div>
                </div>

                {/* Top Selling Products */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Top selling products</h3>
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                    </div>

                    <Table
                            columns={topSellingProductsColumns}
                            dataSource={topSellingProducts}
                            loading={loading}
                            rowKey="id"
                            pagination={{
                                current: pagination.current,
                                pageSize: pagination.pageSize,
                                total: pagination.total, // Tổng số sản phẩm sau khi giới hạn
                                position: ['bottomCenter'],
                                showSizeChanger: false,
                                showQuickJumper: false,
                                onChange: (page) => setPagination({ ...pagination, current: page }),
                            }}
                        />
                </div>
                
                {/* Sales Overview */}
                <div className="bg-white p-6 rounded-lg shadow mb-8">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="text-lg font-semibold">Sales Overview</h3>
                        <MoreVertical className="w-4 h-4 text-gray-400" />
                    </div>
                    <div className='flex justify-betwwen' style={{ width: '100%', height: '100%' }}>
                        <BarChart width={1000} height={600} data={salesData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <TooltipRecharts />
                            <Bar dataKey="max" fill="#3b82f6" />
                            <Bar dataKey="min" fill="#93c5fd" />
                        </BarChart>
                    </div>
                </div>

                {/* Top Selling Products and Sales Overview */}
                <div className="grid grid-cols-2 gap-6 mb-8">
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Top customers</h3>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <Table
                            columns={potentialCustomersColumns}
                            dataSource={potentialCustomers}
                            loading={loading}
                            rowKey="id"
                        />
                    </div>

                    {/*  */}
                    <div className="bg-white p-6 rounded-lg shadow">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-semibold">Recent Orders</h3>
                            <MoreVertical className="w-4 h-4 text-gray-400" />
                        </div>
                        <Table
                            columns={recentOrdersColumns}
                            dataSource={recentOrders}
                            loading={loading}
                            rowKey="id"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SellerDashboard;