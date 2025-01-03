import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOneProduct } from '../../redux/actions/admin/productManagementAction';
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

const ProductManagementDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const axiosPrivate = useAxiosPrivate();
    const { currentProduct, loading } = useSelector(state => state.admin.product);

    // useEffect(() => {
    //     if (id) {
    //         // Assuming you'll create this action
    //         dispatch(fetchOneProduct({ productId: parseInt(id, 10), axiosInstance: axiosPrivate }));
    //     }
    // }, [id, dispatch]);

    useEffect(() => {
        const loadProduct = async () => {
            try {
                const resultAction = await dispatch(
                    fetchOneProduct({
                        productId: parseInt(id, 10),
                        axiosInstance: axiosPrivate
                    })
                ).unwrap();

                console.log('Fetched product:', resultAction); // Log the fetched product details
            } catch (error) {
                console.error('Error fetching product:', error);
            }
        };

        loadProduct();
    }, [dispatch, axiosPrivate, id]);

    return (
        <div className="p-6">
            <Space className="mb-4">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate('/admin/product-management')}
                >
                    Back
                </Button>
            </Space>

            {loading ? (
                <div className="flex justify-center items-center min-h-screen">
                    <Spin size="large" />
                </div>
            ) : !currentProduct ? (
                <Card className="text-center p-6">
                    <Text type="secondary">Product not found</Text>
                </Card>
            ) : (
                <Card className="shadow-lg">
                    {/* Header Section */}
                    <div className="flex items-center mb-6">
                        <img
                            src={currentProduct.thumbnail_url}
                            alt={currentProduct.name}
                            className="w-24 h-24 rounded-lg object-cover mr-6"
                        />
                        <div className="flex-grow">
                            <div className="flex items-center gap-3">
                                <Title level={3} className="mb-0">{currentProduct.name}</Title>
                                {currentProduct.is_official === "true" && (
                                    <Tag color="blue" icon={<CheckCircleFilled />} className="mt-1">
                                        Official Store
                                    </Tag>
                                )}
                            </div>
                            <Text className="text-gray-500">Store ID: {currentProduct.id}</Text>
                        </div>
                        {/* <Space>
                            <Button
                                onClick={() => navigate(`/admin/seller-management/edit/${id}`)}
                                type="default"
                            >
                                Sửa đổi
                            </Button>
                            <Button
                                type="primary"
                                icon={<ShopOutlined />}
                                onClick={() => window.open(currentProduct.url, '_blank')}
                            >
                                Xem sản phẩm
                            </Button>
                        </Space> */}
                    </div>

                    <Divider />
                    {/* Stats Section */}
                    <Row gutter={[24, 24]} className="mb-6">
                        <Col span={8}>
                            <Card className="text-center bg-blue-50">
                                <Statistic
                                    title={<span className="flex items-center justify-center gap-2"><StarFilled className="text-yellow-500" /> Rating</span>}
                                    value={Number(currentProduct.rating_average).toFixed(1)}
                                    suffix={`/ 5.0`}
                                    precision={1}
                                />
                                <Text className="text-gray-500">
                                    {Number(currentProduct.review_count).toLocaleString()} reviews
                                </Text>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center bg-green-50">
                                <Statistic
                                    title={<span className="flex items-center justify-center gap-2"><UserOutlined /> Revenue </span>}
                                    value={Number(currentProduct.price * currentProduct.quantity_sold).toLocaleString()}
                                />
                                <Text className="text-gray-500">VND</Text>
                            </Card>
                        </Col>
                        <Col span={8}>
                            <Card className="text-center bg-purple-50">
                                <Statistic
                                    title="Seller"
                                    value={currentProduct?.current_seller.name || 'N/A'}
                                    className="text-purple-600"
                                />
                                <Text className="text-gray-500">

                                    {Number(currentProduct.current_seller.rating).toLocaleString() }
                                    <StarFilled className="text-yellow-500" />
                                </Text>
                            </Card>
                        </Col>
                    </Row>

                    {/* Quick Links */}
                    <div className="space-y-4">
                        <Title level={4}>Quản lý</Title>
                        <Row gutter={[16, 16]}>
                            {[
                                { label: 'View Reviews', action: () => navigate(`/admin/product-management/${id}/products`) },
                                { label: 'Performance Analytics', action: () => navigate(`/admin/product-management/${id}/analytics`) },
                            ].map((item) => (
                                <Col span={12} key={item.label}>
                                    <Button disabled className="w-full h-12" onClick={item.action}>
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

export default ProductManagementDetailPage;