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
                    {record?.OrderItems?.map((item) => (
                        <div key={item.id} className="flex items-center mb-2">
                            <img
                                src={item?.Product?.thumbnail_url}
                                className="w-10 h-10 rounded object-cover border border-gray-200"
                                alt={item?.Product?.name}
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
                    {record?.OrderItems?.map((item) => (
                        <div key={item.id} className="mb-2">
                            <Text strong>{item?.Product?.name || 'No Product Data'}</Text>
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
                    {record?.OrderItems?.map((item) => (
                        <div key={item.id} className="mb-2">
                            <Text>{item?.Product?.category_name || 'No Category'}</Text>
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
                    {record?.OrderItems?.map((item) => (
                        <div key={item.id} className="mb-2">
                            <Text strong>
                                ₫{Number(item?.Product?.price).toLocaleString() || 'N/A'}
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
                    {record?.OrderItems?.map((item) => (
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
                    {record?.OrderItems?.map((item) => {
                        const totalPrice = parseFloat(item?.Product?.price || 0) * item?.quantity || 0;
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



    // const columns = [
    //     {
    //         title: 'No.',
    //         key: 'index',
    //         width: '60px',
    //         render: (_, __, index) => (
    //             <Text>
    //                 {(pagination.current - 1) * pagination.pageSize + index + 1}
    //             </Text>
    //         ),
    //     },
    //     {
    //         title: 'Image',
    //         key: 'thumbnail_url',
    //         width: '80px',
    //         render: (_, record) => {
    //             return (
    //                 <div>
    //                     {record?.OrderItems?.map((item) => (
    //                         <div key={item.id} className="flex items-center">
    //                             <img
    //                                 src={item?.Product?.thumbnail_url}
    //                                 className="w-10 h-10 rounded object-cover border border-gray-200"
    //                             />
    //                         </div>
    //                     ))}
    //                 </div>
    //             )
    //         }
    //     },
    //     {
    //         title: 'Product Name',
    //         key: 'name',
    //         render: (_, record) => {
    //             const products = record.OrderItems.map(item => {
    //                 const product = item.Product;
    //                 return product
    //                     ? (
    //                         <div key={product.id} className="mb-2">
    //                             <Text strong className="block">{product.name}</Text>
    //                             <Text type="secondary" className="text-xs">
    //                                 Seller ID: {product.current_seller?.id || 'N/A'}, Store ID: {product.current_seller?.store_id || 'N/A'}
    //                             </Text>
    //                         </div>
    //                     )
    //                     : <Text type="secondary" className="block">No Product Data</Text>;
    //             });
    //
    //             return <div>{products}</div>;
    //         }
    //
    //     },
    //     {
    //         title: 'Category',
    //         key: 'category_name',
    //         width: '120px',
    //         render: (_, record) => {
    //             // Lấy danh sách category từ các OrderItems
    //             const categories = record.OrderItems
    //                 .map(item => item.Product?.category_name) // Truy xuất category_name từ Product
    //                 .filter(Boolean); // Loại bỏ giá trị null/undefined
    //
    //             // Hiển thị danh sách category, phân cách bằng dấu phẩy
    //             return (
    //                 <Text>{categories.join(', ') || 'No Category'}</Text>
    //             );
    //         },
    //     },
    //     {
    //         title: 'Price',
    //         key: 'price',
    //         width: '180px',
    //         render: (_, record) => {
    //             const products = record.OrderItems.map(item => {
    //                 const product = item.Product;
    //                 if (!product) {
    //                     return (
    //                         <Text key={item.id} type="secondary" className="block">
    //                             No Product Data
    //                         </Text>
    //                     );
    //                 }
    //
    //                 const originalPrice = product.price / (1 - product.discount_rate / 100); // Tính giá gốc nếu cần
    //                 return (
    //                     <div key={product.id} className="mb-2">
    //                         <Text strong className="block">
    //                             ₫{Number(product.price).toLocaleString()}
    //                         </Text>
    //                         {product.discount_rate > 0 && (
    //                             <div className="flex items-center gap-2">
    //                                 <Text delete type="secondary" className="text-xs">
    //                                     ₫{Number(originalPrice).toLocaleString()}
    //                                 </Text>
    //                                 <Tag color="red">-{product.discount_rate}%</Tag>
    //                             </div>
    //                         )}
    //                     </div>
    //                 );
    //             });
    //
    //             return <div>{products}</div>;
    //         }
    //     },
    //     {
    //         title: 'Quantity',
    //         key: 'qty',
    //         width: '90px',
    //         render: (_, record) => {
    //             // Duyệt qua các OrderItems và lấy quantity từ mỗi item
    //             const quantities = record.OrderItems.map(item => item.quantity);
    //
    //             // Nếu có nhiều hơn 1 OrderItem, có thể cần phải xử lý theo cách khác
    //             return <Text>{quantities.join(', ')}</Text>;
    //         },
    //     },
    //     {
    //         title: 'State',
    //         key: 'quantity_sold',
    //         width: '100px',
    //         render: (_, record) => <Text>{record.status || 'N/A'}</Text>,
    //     },
    //     {
    //         title: 'Total price',
    //         key: 'total_price',
    //         width: '120px',
    //         render: (_, record) => {
    //             const totalPrice = record?.OrderItems?.reduce((acc, item) => {
    //                 const price = parseFloat(item?.Product?.price || 0);
    //                 const quantity = item?.quantity || 0;
    //                 return acc + (price * quantity);
    //             }, 0);
    //             return <Text>{`₫${totalPrice.toLocaleString()}`}</Text>;
    //         },
    //     },
    //     {
    //         title: 'Actions',
    //         key: 'actions',
    //         width: '80px',
    //         fixed: 'right',
    //         render: (_, record) => (
    //             <Space size="middle">
    //                 <Tooltip title="Delete">
    //                     <Button
    //                         type="link"
    //                         icon={<DeleteOutlined />}
    //                         onClick={() => handleDelete(record)}
    //                         className="text-red-600 p-0 hover:text-red-800"
    //                     />
    //                 </Tooltip>
    //             </Space>
    //         ),
    //     },
    // ];

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
                />
            </Card>
        </div>
    );
};

export default UserWithOrderPage;