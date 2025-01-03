import React, { useState, useEffect } from 'react';
import { Table, Space, Button, Input, Card, Typography, Tooltip, message, Tag, Modal } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllProducts, deleteProduct, restoreProduct } from '../../redux/actions/admin/productManagementAction';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useDispatch } from 'react-redux';
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    RedoOutlined,
    ArrowLeftOutlined, UndoOutlined, CheckOutlined, StopOutlined
} from '@ant-design/icons';

const { Text } = Typography;

const ProductManagement = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch(); // Added missing dispatch
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
                fetchAllProducts({
                    axiosInstance: axiosPrivate,
                    id,
                    page,
                    limit: pageSize,
                    search,
                })
            );

            if (fetchAllProducts.fulfilled.match(resultAction)) {
                const { products, totalCount, currentPage, pageSize, search } = resultAction.payload;
                setProducts(products);
                setPagination({
                    current: currentPage,
                    pageSize,
                    total: totalCount,
                    search: search,
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
    }, [id]); // Added searchText to dependencies

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

    const handleDelete = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to delete this product?',
            content: `Product Name: ${record.name}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    await dispatch(deleteProduct({ id: record.id, axiosInstance: axiosPrivate }));
                    message.success('Product deleted successfully');
                    fetchProducts(pagination.current, pagination.pageSize, searchText);
                } catch (error) {
                    message.error('Failed to delete product: ' + error.message);
                }
            },
        });
    };
    const handleRestored = (record) => {
        Modal.confirm({
            title: 'Are you sure you want to restore this product?',
            content: `Product Name: ${record.name}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk: async () => {
                try {
                    if (record.qty) {
                        await dispatch(restoreProduct({ id: record.id, axiosInstance: axiosPrivate }));
                        message.success('Product restored successfully');
                        fetchProducts(pagination.current, pagination.pageSize, searchText);
                    } else {
                        message.error('Product cannot be restored because it is out of stock');
                    }
                } catch (error) {
                    message.error('Failed to unsuspend product: ' + error.message);
                }
            },
        });
    };

    const handleView = (record) => {
        navigate(`/admin/product-management/${record.id}`);
    }

    const columns = [
        {
            title: 'No.',
            key: 'index',
            width: '50px',
            render: (_, __, index) => (
                <Text>
                    {(pagination.current - 1) * pagination.pageSize + index + 1}
                </Text>
            ),
        },
        {
            title: 'Ảnh',
            key: 'thumbnail_url',
            width: '70px',
            render: (_, record) => (
                <img
                    src={record.thumbnail_url}
                    alt={record.name}
                    className="w-10 h-10 rounded object-cover border border-gray-200"
                />
            ),
        },
        {
            title: 'Tên SP',
            key: 'name',
            width: '400px',
            render: (_, record) => (
                <div>
                    <Text strong className="block">{record.name}</Text>
                    <Text type="secondary" className="text-xs">SKU: {record.current_seller?.sku}</Text>
                </div>
            ),
        },
        {
            title: 'Danh mục',
            key: 'category_name',
            width: '90px',
            render: (_, record) => <Text>{record.category_name}</Text>,
        },
        {
            title: 'Giá',
            key: 'price',
            width: '180px',
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
            sorter: (a, b) => (a.price || 0) - (b.price || 0),
        },
        {
            title: 'SL Tồn',
            key: 'qty',
            width: '80px',
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
            sorter: (a, b) => (a.qty || 0) - (b.qty || 0),
        },
        {
            title: 'SL Bán',
            key: 'quantity_sold',
            width: '50px',
            render: (_, record) => <Text>{record.quantity_sold}</Text>,
            sorter: (a, b) => (a.quantity_sold || 0) - (b.quantity_sold || 0),
        },
        {
            title: 'Rating',
            key: 'rating_average',
            width: '70px',
            render: (_, record) => (
                <Text>
                    {record.rating_average ? `${record.rating_average} ⭐` : 'No rating'}
                </Text>
            ),
            sorter: (a, b) => (a.rating_average || 0) - (b.rating_average || 0),
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '80px',
            fixed: 'right',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Product">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                            className="text-blue-600 p-0 hover:text-gray-800"
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleView(record)}
                            className="text-yellow-600 p-0 hover:text-gray-800"
                        />
                    </Tooltip>
                    <Tooltip title={record.inventory_status == 'available' ? 'suspend' : 'available'}>
                        <Button
                            type="link"
                            icon={record.inventory_status == 'available' ? <DeleteOutlined /> : <RedoOutlined />}
                            onClick={() => {
                                record.inventory_status == 'available' ? handleDelete(record) : handleRestored(record)
                            }}
                            className={record.inventory_status == 'available' ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <Card title="Quản lý sản phẩm" className="shadow-md">
                <div className="mb-4 flex justify-between items-center">
                    <Input
                        placeholder="Search products..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        onPressEnter={handleSearch}
                        className="w-64"
                    />
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

export default ProductManagement;