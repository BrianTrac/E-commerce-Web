import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSellerAnalytics } from '../../redux/actions/admin/sellerManagementAction';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Card, Row, Col, Typography, Statistic, Space, Button, Divider, Spin, Pagination } from 'antd';
import { ArrowLeftOutlined } from '@ant-design/icons';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';
import { ExportButtons } from '../../components/admin/ExportButtons';
const { Title, Text } = Typography;

const SellerAnalyticsPage = () => {
    const pieChartRef = useRef(null);
    const barChartRef = useRef(null);
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const { analytics, loading } = useSelector(state => state.admin.sellers);

    const [currentPage, setCurrentPage] = useState(1);
    const [filteredCategories, setFilteredCategories] = useState([]);
    const pageSize = 5;

    useEffect(() => {
        if (id) {
            dispatch(fetchSellerAnalytics({ id, axiosInstance: axiosPrivate }));
        }
    }, [id, dispatch]);

    useEffect(() => {
        if (analytics?.categories) {
            setFilteredCategories(analytics.categories);
        }
    }, [analytics]);

    const COLORS = ['#1890ff', '#52c41a', '#faad14', '#f5222d', '#13c2c2', '#722ed1', '#eb2f96', '#fa541c'];

    const formatRevenue = (value) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const paginatedCategories = filteredCategories.slice(
        (currentPage - 1) * pageSize,
        currentPage * pageSize
    );

    const barChartData = analytics?.products?.map(product => ({
        name: product.name,
        totalSales: parseInt(product.total_sales),
    })) || [];

    const pieData = filteredCategories.map(category => ({
        name: category.category_name ? category.category_name : 'Không xác định',
        value: parseInt(category.total_sales),
    }));

    return (
        <div className="p-6">
            <Space className="mb-4">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(-1)}
                >
                    Back
                </Button>
            </Space>

            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Spin size="large" />
                </div>
            ) : !analytics ? (
                <Card className="text-center p-6">
                    <Text type="secondary">No analytics data available</Text>
                </Card>
            ) : (
                <Card className="shadow-lg">
                    <Title level={4}>Analytics Overview</Title>
                    <ExportButtons analytics={analytics} />
                    <Row gutter={[24, 24]} className="m-6">
                        <Col span={8}>
                            <Card className="text-center bg-blue-50">
                                <Statistic
                                    title="Total Products"
                                    value={analytics.totalProducts}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center bg-green-50">
                                <Statistic
                                    title="Total Revenue"
                                    value={formatRevenue(analytics.totalRevenue)}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center bg-purple-50">
                                <Statistic
                                    title="Total Categories"
                                    value={analytics.categories?.length || 0}
                                />
                            </Card>
                        </Col>
                    </Row>

                    <Divider />
                    <Title level={5}>Tỉ lệ bán của các danh mục</Title>
                    <Row gutter={[24, 24]} className="mt-6">
                        <Col span={16}>
                            <Card style={{ height: '400px' }}>
                                <ResponsiveContainer width="100%" height={300}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius={120}
                                            innerRadius={0}
                                            fill="#8884d8"
                                            dataKey="value"
                                        >
                                            {pieData.map((entry, index) => (
                                                <Cell
                                                    key={`cell-${index}`}
                                                    fill={COLORS[index % COLORS.length]}
                                                />
                                            ))}
                                        </Pie>
                                        <Tooltip formatter={(value) => `${formatRevenue(value)}`} />
                                        <Legend
                                            layout="vertical"
                                            align="right"
                                            width='30%'
                                            verticalAlign="middle"
                                            wrapperStyle={{ overflowY: 'auto', maxHeight: 200 }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                            </Card>
                        </Col>

                        <Col span={8}>
                            <Card style={{ height: '400px', overflowY: 'auto' }}>
                                {paginatedCategories.map((category, index) => (
                                    <Card
                                        key={index}
                                        style={{ marginBottom: '16px', backgroundColor: '#f5f5f5' }}
                                    >
                                        <Statistic
                                            title={category.category_name ? category.category_name : 'Không xác định'}
                                            value={formatRevenue(parseInt(category.total_sales))}
                                            style={{ marginBottom: '8px' }}
                                        />
                                        <Text type="secondary">
                                            {((parseInt(category.total_sales) / analytics.totalRevenue) * 100).toFixed(1)}% of total revenue
                                        </Text>
                                    </Card>
                                ))}
                            </Card>
                            <Pagination
                                current={currentPage}
                                pageSize={pageSize}
                                total={filteredCategories.length}
                                onChange={page => setCurrentPage(page)}
                                style={{ textAlign: 'center', marginTop: '16px' }}
                            />
                        </Col>
                    </Row>
                    <Divider />

                    <Title level={5}>Top 10 sản phẩm bán chạy nhất</Title>
                    <Card className="mt-6">
                        <div style={{ height: '600px', width: '100%' }}>
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart
                                    data={barChartData}
                                    margin={{ top: 20, right: 30, left: 60, bottom: 60 }}
                                >
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis
                                        dataKey="name"
                                        formatter={(value) => value.length > 10 ? `${value.slice(0, 10)}...` : value}
                                        tick={{ fontSize: 12 }}
                                        angle={-45}
                                        textAnchor="end"
                                        height={60}
                                    />
                                    <YAxis
                                        tickFormatter={(value) => `${(value / 1_000_000).toFixed(0)}M`}
                                        width={50}
                                    />
                                    <Tooltip
                                        formatter={(value) => formatRevenue(value)}
                                        cursor={{ fill: 'rgba(0, 0, 0, 0.1)' }}
                                    />
                                    <Bar
                                        dataKey="totalSales"
                                        fill="#1890ff"
                                        name="Revenue"
                                        maxBarSize={50}
                                    />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </Card>
                </Card>
            )}
        </div>
    );
};

export default SellerAnalyticsPage;