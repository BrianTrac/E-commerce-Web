import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Card, Typography, Tooltip, message, Spin, Tag } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    RedoOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';

const { Text } = Typography;
import { sellerApi } from '../../service/productApi';

const SellerProductPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [searchText, setSearchText] = useState('');
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        current: 1,
        pageSize: 10,
        total: 0
    });

    const fetchProducts = async (page = 1, pageSize = 10, search = '') => {
        setLoading(true);
        try {

            const data = await sellerApi.getProducts(id, { page, limit: pageSize, search });

            setProducts(data.data);
            setPagination({
                ...pagination,
                current: page,
                pageSize,
                total: data.total
            });
        } catch (error) {
            message.error('Failed to load products: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts(pagination.current, pagination.pageSize);
    }, [id]);

    const handleSearch = () => {
        fetchProducts(1, pagination.pageSize, searchText);
    };

    const handleTableChange = (newPagination) => {
        fetchProducts(newPagination.current, newPagination.pageSize, searchText);
    };

    const handleRefresh = () => {
        setSearchText('');
        fetchProducts(1, pagination.pageSize, '');
    };

    const handleView = (record) => {
        console.log('View product:', record);
        // Navigate or view product details
    };

    const handleEdit = (record) => {
        console.log('Edit product:', record);
        // Add edit logic here
    };

    const handleDelete = async (record) => {
        try {
            const response = await fetch(`http://localhost:4000/api/admin/seller/${id}/products/${record.id}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error(`Failed to delete product ${record.id}`);
            }

            message.success('Product deleted successfully');
            fetchProducts(pagination.current, pagination.pageSize, searchText);
        } catch (error) {
            message.error('Failed to delete product: ' + error.message);
        }
    };

    const columns = [
        {
            title: 'No.',
            key: 'index',
            width: '60px',
            render: (_, __, index) => (
                <Text>
                    {(pagination.current - 1) * pagination.pageSize + index + 1}
                </Text>
            ),
        },
        {
            title: 'Image',
            key: 'thumbnail_url',
            width: '80px',
            render: (_, record) => (
                <img
                    src={record.thumbnail_url}
                    alt={record.name}
                    className="w-10 h-10 rounded object-cover border border-gray-200"
                />
            ),
        },
        {
            title: 'Product Name',
            key: 'name',
            render: (_, record) => (
                <div>
                    <Text strong className="block">{record.name}</Text>
                    <Text type="secondary" className="text-xs">SKU: {record.current_seller?.sku}</Text>
                </div>
            ),
        },
        {
            title: 'Category',
            key: 'category_name',
            width: '120px',
            render: (_, record) => <Text>{record.category_name}</Text>,
        },
        {
            title: 'Price',
            key: 'price',
            width: '150px',
            render: (_, record) => (
                <div>
                    <Text strong className="block">
                        ₫{Number(record.price).toLocaleString()}
                    </Text>
                    {record.discount_rate > 0 && (
                        <div className="flex items-center gap-2">
                            <Text delete type="secondary" className="text-xs">
                                ₫{Number(record.original_price).toLocaleString()}
                            </Text>
                            <Tag color="red">-{record.discount_rate}%</Tag>
                        </div>
                    )}
                </div>
            ),
        },
        {
            title: 'Stock',
            key: 'qty',
            width: '100px',
            render: (_, record) => (
                <div>
                    <Text>{record.qty}</Text>
                    <Tag
                        color={record.inventory_status === 'available' ? 'green' : 'red'}
                        className="ml-2"
                    >
                        {record.inventory_status}
                    </Tag>
                </div>
            ),
        },
        {
            title: 'Sold',
            key: 'quantity_sold',
            width: '100px',
            render: (_, record) => <Text>{record.quantity_sold}</Text>,
        },
        {
            title: 'Rating',
            key: 'rating_average',
            width: '100px',
            render: (_, record) => (
                <Text>
                    {record.rating_average ? `${record.rating_average} ⭐` : 'No rating'}
                </Text>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '150px',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Product">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                            className="text-blue-600 p-0 hover:text-blue-800"
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            className="text-green-600 p-0 hover:text-green-800"
                        />
                    </Tooltip>
                    <Tooltip title="Delete">
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                            className="text-red-600 p-0 hover:text-red-800"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Space className="mb-4">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(`/admin/seller-management/${id}`)}
                >
                    Back
                </Button>
            </Space>
            <Card title="Seller's Products" className="shadow-md">
                <div className="mb-4 flex justify-between items-center">
                    <Space>
                        <Input
                            placeholder="Search products..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={handleSearch}
                            className="w-64"
                        />
                        <Button type="primary" onClick={handleSearch}>
                            Search
                        </Button>
                    </Space>
                    <Button
                        onClick={handleRefresh}
                        icon={<RedoOutlined />}
                    >
                        Refresh
                    </Button>
                </div>

                <Table
                    columns={columns}
                    dataSource={products}
                    rowKey="id"
                    loading={loading}
                    pagination={{
                        ...pagination,
                        showSizeChanger: true,
                        showQuickJumper: true,
                        showTotal: (total) => `Total ${total} products`,
                        position: ['bottomCenter'],
                    }}
                    onChange={handleTableChange}
                    className="border border-gray-200 rounded"
                    scroll={{ x: 1200 }}
                />
            </Card>
        </div>
    );
};

export default SellerProductPage;