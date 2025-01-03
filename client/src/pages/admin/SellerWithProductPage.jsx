import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Card, Typography, Tooltip, message, Tag } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchSellerProducts } from '../../redux/actions/admin/sellerManagementAction';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useDispatch } from 'react-redux';
import {
    SearchOutlined,
    RedoOutlined,
    ArrowLeftOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    CheckOutlined,
    UndoOutlined,
} from '@ant-design/icons';
import { sortProductByStatus } from '../../helpers/sortProductByStatus';

const { Text } = Typography;

const SellerProductPage = () => {
    const { id } = useParams();
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
                fetchSellerProducts({
                    axiosInstance: axiosPrivate,
                    id,
                    page,
                    limit: pageSize,
                    search,
                })
            );

            if (fetchSellerProducts.fulfilled.match(resultAction)) {
                let { products, totalCount, currentPage, pageSize } = resultAction.payload;
                products = sortProductByStatus(products);

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

    useEffect(() => {
        fetchProducts(pagination.current, pagination.pageSize, searchText);
    }, [id]);

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
            const response = await axiosPrivate.patch(`/api/admin/seller/${id}/products/${record.id}/suspend`);

            if (response.status === 200) {
                message.success('Product suspended successfully');
                fetchProducts(pagination.current, pagination.pageSize, searchText);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error('Failed to suspend product: ' + error.message);
        }
    };

    const handleRecover = async (record) => {
        try {
            if (record.qty) {
                const response = await axiosPrivate.patch(`/api/admin/seller/${id}/products/${record.id}/unsuspend`);

                if (response.status === 200) {
                    message.success('Product recovered successfully');
                    fetchProducts(pagination.current, pagination.pageSize, searchText);
                } else {
                    throw new Error(response.message);
                }
            } else {
                message.error('Product must have stock to recover');
            }
        } catch (error) {
            message.error('Failed to recover product: ' + error.message);
        }
    };

    const handleAccept = async (record) => {
        try {
            const response = await axiosPrivate.patch(`/api/admin/seller/${id}/products/${record.id}/approve`);

            if (response.status === 200) {
                message.success('Product approved successfully');
                fetchProducts(pagination.current, pagination.pageSize, searchText);
            } else {
                throw new Error(response.message);
            }
        } catch (error) {
            message.error('Failed to approve product: ' + error.message);
        }
    };

    const renderActionButtons = (record) => {
        const buttons = [
            <Tooltip key="view" title="View Product">
                <Button
                    type="link"
                    icon={<EyeOutlined />}
                    onClick={() => handleView(record)}
                    className="text-blue-600 p-0 hover:text-blue-800"
                    disabled
                />
            </Tooltip>,
            <Tooltip key="edit" title="Edit">
                <Button
                    type="link"
                    icon={<EditOutlined />}
                    onClick={() => handleEdit(record)}
                    className="text-green-600 p-0 hover:text-green-800"
                    disabled
                />
            </Tooltip>
        ];

        switch (record.inventory_status) {
            case 'available':
                buttons.push(
                    <Tooltip key="delete" title="Suspend">
                        <Button
                            type="link"
                            icon={<DeleteOutlined />}
                            onClick={() => handleDelete(record)}
                            className="text-red-600 p-0 hover:text-red-800"
                        />
                    </Tooltip>
                );
                break;
            case 'suspend':
                buttons.push(
                    <Tooltip key="recover" title="Recover">
                        <Button
                            type="link"
                            icon={<UndoOutlined />}
                            onClick={() => handleRecover(record)}
                            className="text-blue-600 p-0 hover:text-blue-800"
                        />
                    </Tooltip>
                );
                break;
            case 'pending':
                buttons.push(
                    <Tooltip key="accept" title="Approve">
                        <Button
                            type="link"
                            icon={<CheckOutlined />}
                            onClick={() => handleAccept(record)}
                            className="text-green-600 p-0 hover:text-green-800"
                        />
                    </Tooltip>
                );
                break;
        }

        return <Space size="middle">{buttons}</Space>;
    };

    const columns = [
        {
            title: 'No.',
            key: 'index',
            responsive: ['lg'],
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
            responsive: ['md'],
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
            width: '200px',
            render: (_, record) => (
                <div className="min-w-[150px]">
                    <Text strong className="block text-sm md:text-base">{record.name}</Text>
                    <Text type="secondary" className="text-xs md:text-sm">SKU: {record.current_seller?.sku}</Text>
                </div>
            ),
        },
        {
            title: 'Stock',
            key: 'qty',
            width: '100px',
            render: (_, record) => (
                <div className="flex justify-between items-center">
                    <Text>{record.qty}</Text>
                    <Tag
                        color={
                            record.inventory_status === 'available'
                                ? 'green'
                                : record.inventory_status === 'pending'
                                    ? 'yellow'
                                    : 'red'
                        }
                        className="ms-auto"
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
            title: 'Actions',
            key: 'actions',
            width: '150px',
            fixed: 'right',
            render: (_, record) => renderActionButtons(record),
        },
    ];

    return (
        <div className="p-2 md:p-4">
            <Space className="mb-2 md:mb-4">
                <Button
                    icon={<ArrowLeftOutlined />}
                    onClick={() => navigate(`/admin/seller-management/${id}`)}
                    className="text-sm md:text-base"
                >
                    Back
                </Button>
            </Space>
            <Card
                title="Seller's Products"
                className="shadow-md overflow-hidden"
            >
                {/* Search và Refresh button */}
                <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2 md:gap-4">
                    <Space className="flex-1 w-full md:w-auto flex flex-col md:flex-row">
                        <Input
                            placeholder="Search products..."
                            prefix={<SearchOutlined />}
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            onPressEnter={handleSearch}
                            className="w-full md:w-64 text-sm md:text-base"
                        />
                        <Button
                            type="primary"
                            onClick={handleSearch}
                            className="w-full md:w-auto mt-2 md:mt-0"
                        >
                            Search
                        </Button>
                    </Space>
                    <Button
                        onClick={handleRefresh}
                        icon={<RedoOutlined />}
                        className="w-full md:w-auto"
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
                        size: 'small',
                        responsive: true,
                    }}
                    onChange={handleTableChange}
                    className="border border-gray-200 rounded"
                    scroll={{ x: 'max-content' }}
                    size="small"
                />
            </Card>
        </div>
    );
};

export default SellerProductPage;