import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Card, Typography, Tooltip, message, Tag } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchUserOrderList } from '../../redux/actions/admin/userManagementAction';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useDispatch } from 'react-redux';
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    RedoOutlined,
    ArrowLeftOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const UserWithOrderPage = () => {
    const { id } = useParams();
    console.log('id', id);
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch(); 
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
            const resultAction = await dispatch(
                fetchUserOrderList({
                    axiosInstance: axiosPrivate,
                    id,
                    page,
                    limit: pageSize,
                    search,
                })
            );

            if (fetchUserOrderList.fulfilled.match(resultAction)) {
                const { products, totalCount, currentPage, pageSize } = resultAction.payload;
                setProducts(products);
                setPagination({
                    current: currentPage,
                    pageSize,
                    total: totalCount,
                });
            } else {
                message.error(resultAction.error?.message || 'Failed to load products');
            }
        } catch (error) {
            message.error('Failed to load products: ' + error.message);
        } finally {
            setLoading(false);
        }
    };

    console.log("UserWithOrderPage", products);

    useEffect(() => {
        fetchProducts(pagination.current, pagination.pageSize, searchText);
    }, [id]); // Added searchText to dependencies

    // Debounced search function
    const handleSearch = React.useCallback(() => {
        fetchProducts(1, pagination.pageSize, searchText);
    }, [searchText, pagination.pageSize]);

    const handleTableChange = (newPagination) => {
        fetchProducts(newPagination.current, newPagination.pageSize, searchText);
    };

    const handleRefresh = () => {
        setSearchText('');
        fetchProducts(1, pagination.pageSize, '');
    };

    const handleDelete = async (record) => {
        try {
            const response = await axiosPrivate.delete(`/admin/seller/${id}/products/${record.id}`);

            if (response.status === 200) {
                message.success('Product deleted successfully');
                fetchProducts(pagination.current, pagination.pageSize, searchText);
            } else {
                throw new Error('Failed to delete product');
            }
        } catch (error) {
            message.error('Failed to delete product: ' + error.message);
        }
    };

    const columns = [
        {
            title: 'No.',
            key: 'index',
            width: '60px',
            render: (_, record, index) => (
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
                <div>
                    {record?.orderItems?.map((item) => (
                        <div key={item.id} className="flex items-center mb-2">
                            <img
                                src={item?.product?.thumbnail_url}
                                className="w-10 h-10 rounded object-cover border border-gray-200"
                                alt={item?.product?.name}
                            />
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Product Name',
            key: 'name',
            width: '250px',
            render: (_, record) => (
                <div>
                    {record?.orderItems?.map((item) => (
                        <div key={item.id} className="mb-2">
                            <Text strong>{item?.product?.name || 'No Product Data'}</Text>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Category',
            key: 'category_name',
            render: (_, record) => (
                <div>
                    {record?.orderItems?.map((item) => (
                        <div key={item.id} className="mb-2">
                            <Text>{item?.product?.category_name || 'No Category'}</Text>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Price',
            key: 'price',
            render: (_, record) => (
                <div>
                    {record?.orderItems?.map((item) => (
                        <div key={item.id} className="mb-2">
                            <Text strong>
                                ₫{Number(item?.product?.price).toLocaleString() || 'N/A'}
                            </Text>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Quantity',
            key: 'qty',
            render: (_, record) => (
                <div>
                    {record?.orderItems?.map((item) => (
                        <div key={item.id} className="mb-2">
                            <Text>{item.quantity || 'N/A'}</Text>
                        </div>
                    ))}
                </div>
            ),
        },
        {
            title: 'Total price',
            key: 'total_price',
            render: (_, record) => (
                <div>
                    {record?.orderItems?.map((item) => {
                        const totalPrice = parseFloat(item?.product?.price || 0) * item?.quantity || 0;
                        return (
                            <div key={item.id} className="mb-2">
                                <Text>₫{totalPrice.toLocaleString()}</Text>
                            </div>
                        );
                    })}
                </div>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '80px',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
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
                    onClick={() => navigate(`/admin/user-management/${id}`)}
                >
                    Back
                </Button>
            </Space>
            <Card title="User Order List" className="shadow-md">
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
                        Tải lại
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
                />
            </Card>
        </div>
    );
};

export default UserWithOrderPage;