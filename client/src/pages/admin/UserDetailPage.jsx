import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchOneUser, fetchUserTotalSpent } from '../../redux/actions/admin/userManagementAction';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { Card, Row, Col, Typography, Statistic, Button, Tag, Divider, Spin, Space } from 'antd';
import {
    ShopOutlined,
    StarFilled,
    UserOutlined,
    CheckCircleFilled,
    ArrowLeftOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;

const UserDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const { currentUser, totalSpent, orderCount, loading, error } = useSelector(state => state.admin.users);

    useEffect(() => {
        if (id) {
            // Assuming you'll create this action
            dispatch(fetchOneUser({ id, axiosInstance: axiosPrivate }));
            dispatch(fetchUserTotalSpent({ id, axiosInstance: axiosPrivate }));
        }
    }, [id, dispatch]);
    console.log('Total spent:', totalSpent);


    return (
        <div className="p-6">
            <Space className="mb-4">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/admin/user-management')}
                >
                    Back
                </Button>
            </Space>

            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Spin size="large" />
                </div>
            ) : !currentUser ? (
                <Card className="text-center p-6">
                    <Text type="secondary">User not found</Text>
                </Card>
            ) : (
                <Card className="shadow-lg">
                    {/* Header Section */}
                    <div className="flex items-center mb-6">
                        <img
                            className="w-24 h-24 rounded-lg object-cover mr-6"
                        />
                        <div className="flex-grow">
                            <div className="flex items-center gap-3">
                                <Title level={3} className="mb-0">{currentUser.user.username}</Title>
                                {currentUser.is_official === "true" && (
                                    <Tag color="blue" icon={<CheckCircleFilled />} className="mt-1">
                                        Official Store
                                    </Tag>
                                )}
                            </div>
                            <Text className="text-gray-500">Email: {currentUser.user.email}</Text>
                        </div>
                        <Space>
                            <Button
                                onClick={() => navigate(`/admin/user-management/edit/${id}`)}
                                type="default"
                            >
                                Edit User
                            </Button>
                        </Space>
                    </div>

                    <Divider />
                    {/* Stats Section */}
                    <Row gutter={[24, 24]} className="mb-6">
                        <Col span={8}>
                            <Card className="text-center bg-blue-50">
                                <Statistic
                                    title={<span className="flex items-center justify-center gap-2"><StarFilled className="text-yellow-500" /> Status </span>}
                                    value={(currentUser.user.is_active)? "Active" : "Inactive"}
                                    precision={1}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center bg-green-50">
                                <Statistic
                                    title={<span className="flex items-center justify-center gap-2"><UserOutlined /> Total purchase amount </span>}
                                    value={`₫${Number(totalSpent).toLocaleString()}`}
                                />
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center bg-purple-50">
                                <Statistic
                                    title="Number of orders"
                                    value={orderCount||0}
                                    className="text-purple-600"
                                />
                            </Card>
                        </Col>
                    </Row>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <Title level={4}>Management Actions</Title>
                        <Row gutter={[16, 16]}>
                            {[
                                { label: 'View Order List', action: () => navigate(`/admin/user-management/${id}/products`) },

                            ].map((item) => (
                                <Col span={24} key={item.label}>
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

export default UserDetailPage;