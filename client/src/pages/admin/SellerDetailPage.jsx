import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneSeller } from '../../redux/actions/admin/sellerManagementAction';
import { Card, Row, Col, Typography, Statistic, Button, Tag, Divider, Spin, Space } from 'antd';
import {
    ShopOutlined,
    StarFilled,
    UserOutlined,
    CheckCircleFilled,
    ArrowLeftOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const SellerDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { currentSeller, loading } = useSelector(state => state.admin.sellers);

    useEffect(() => {
        if (id) {
            // Assuming you'll create this action
            dispatch(fetchOneSeller(id));
        }
    }, [id, dispatch]);

    return (
        <div className="p-6">
            <Space className="mb-4">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/admin/seller-management')}
                >
                    Back
                </Button>
            </Space>

            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Spin size="large" />
                </div>
            ) : !currentSeller ? (
                <Card className="text-center p-6">
                    <Text type="secondary">Seller not found</Text>
                </Card>
            ) : (
                <Card className="shadow-lg">
                    {/* Header Section */}
                    <div className="flex items-center mb-6">
                        <img
                            src={currentSeller.icon}
                            alt={currentSeller.name}
                            className="w-24 h-24 rounded-lg object-cover mr-6"
                        />
                        <div className="flex-grow">
                            <div className="flex items-center gap-3">
                                <Title level={3} className="mb-0">{currentSeller.name}</Title>
                                {currentSeller.is_official === "true" && (
                                    <Tag color="blue" icon={<CheckCircleFilled />} className="mt-1">
                                        Official Store
                                    </Tag>
                                )}
                            </div>
                            <Text className="text-gray-500">Store ID: {currentSeller.id}</Text>
                        </div>
                        <Space>
                            <Button
                                onClick={() => navigate(`/admin/seller-management/edit/${id}`)}
                                type="default"
                            >
                                Edit Seller
                            </Button>
                            <Button
                                type="primary"
                                icon={<ShopOutlined />}
                                onClick={() => window.open(currentSeller.url, '_blank')}
                            >
                                Visit Store
                            </Button>
                        </Space>
                    </div>

                    <Divider />
                    {/* Stats Section */}
                    <Row gutter={[24, 24]} className="mb-6">
                        <Col span={8}>
                            <Card className="text-center bg-blue-50">
                                <Statistic
                                    title={<span className="flex items-center justify-center gap-2"><StarFilled className="text-yellow-500" /> Rating</span>}
                                    value={Number(currentSeller.avg_rating_point).toFixed(1)}
                                    suffix={`/ 5.0`}
                                    precision={1}
                                />
                                <Text className="text-gray-500">
                                    {Number(currentSeller.review_count).toLocaleString()} reviews
                                </Text>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center bg-green-50">
                                <Statistic
                                    title={<span className="flex items-center justify-center gap-2"><UserOutlined /> Followers</span>}
                                    value={Number(currentSeller.total_follower).toLocaleString()}
                                />
                                <Text className="text-gray-500">Active followers</Text>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center bg-purple-50">
                                <Statistic
                                    title="Store Performance"
                                    value={Number(currentSeller.avg_rating_point) >= 4.5 ? "Excellent" :
                                        Number(currentSeller.avg_rating_point) >= 4.0 ? "Good" : "Average"}
                                    className="text-purple-600"
                                />
                                <Text className="text-gray-500">Based on ratings & followers</Text>
                            </Card>
                        </Col>
                    </Row>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <Title level={4}>Management Actions</Title>
                        <Row gutter={[16, 16]}>
                            {[
                                { label: 'View Products', action: () => navigate(`/admin/seller-management/${id}/products`) },
                                { label: 'Performance Analytics', action: () => navigate(`/admin/seller-management/${id}/analytics`) },
                            ].map((item) => (
                                <Col span={12} key={item.label}>
                                    <Button className="w-full h-12" onClick={item.action}>
                                        {item.label}
                                    </Button>
                                </Col>
                            ))}
                        </Row>
                    </div>
                </Card>
            )}
        </div>
    );
};

export default SellerDetailPage;