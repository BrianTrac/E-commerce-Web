import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Space, Button, Input, Card, Typography, Tooltip, Modal } from 'antd';
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    DeleteOutlined,
    ExclamationCircleOutlined,
    RedoOutlined
} from '@ant-design/icons';
import { fetchSellers, setSellersPagination } from '../../redux/reducers/admin';

const { Text } = Typography;
const { confirm } = Modal;

const SellerManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate(); // Define navigate
    const { data: sellers, loading, pagination } = useSelector(state => state.admin.sellers);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        loadSellers();
    }, [pagination.current, pagination.pageSize]);

    const loadSellers = () => {
        dispatch(fetchSellers({
            page: pagination.current,
            limit: pagination.pageSize,
            search: searchText
        }));
    };

    const handleTableChange = (pagination) => {
        dispatch(setSellersPagination(pagination));
    };

    const showDeleteConfirm = (seller) => {
        confirm({
            title: 'Are you sure you want to delete this seller?',
            icon: <ExclamationCircleOutlined />,
            content: `This will permanently delete ${seller.name}`,
            okText: 'Yes',
            okType: 'danger',
            cancelText: 'No',
            onOk() {
                console.log('OK');
                // Add your delete logic here
            },
            onCancel() {
                console.log('Cancel');
            },
        });
    };

    const handleEdit = (record) => {
        console.log('Edit seller:', record);
        // Add your edit logic here
    };

    const handleView = (record) => {
        navigate(`/admin/seller-management/${record.id}`);
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
            title: 'Store Icon',
            key: 'icon',
            width: '80px',
            render: (_, record) => (
                <img
                    src={record.icon}
                    alt={record.name}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
            ),
        },
        {
            title: 'Store Name',
            key: 'name',
            render: (_, record) => (
                <Space direction="vertical" size={1}>
                    <Text strong>{record.name}</Text>
                    {record.isOfficial && (
                        <Text type="success" className="text-xs">
                            Official Store
                        </Text>
                    )}
                </Space>
            ),
        },
        {
            title: 'Rating',
            dataIndex: 'rating',
            key: 'rating',
            width: '100px',
            render: (rating) => (
                <Text>
                    {rating ? `${Number(rating).toFixed(1)} ⭐` : 'No rating'}
                </Text>
            ),
            sorter: (a, b) => (a.rating || 0) - (b.rating || 0),
        },
        {
            title: 'Reviews',
            dataIndex: 'reviewCount',
            key: 'reviewCount',
            width: '100px',
            render: (count) => (
                <Text>{count.toLocaleString()}</Text>
            ),
            sorter: (a, b) => a.reviewCount - b.reviewCount,
        },
        {
            title: 'Followers',
            dataIndex: 'followers',
            key: 'followers',
            width: '100px',
            render: (count) => (
                <Text>{count.toLocaleString()}</Text>
            ),
            sorter: (a, b) => a.followers - b.followers,
        },
        {
            title: 'Actions',
            key: 'actions',
            width: '150px',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Store">
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
                            onClick={() => showDeleteConfirm(record)}
                            className="text-red-600 p-0 hover:text-red-800"
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card title="Seller Management" className="shadow-md">
            <div className="mb-4 flex justify-between items-center">
                <Input
                    placeholder="Search sellers..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    onPressEnter={loadSellers}
                    className="w-64"
                />
                <Button
                    type="primary"
                    onClick={loadSellers}
                    icon={<RedoOutlined />}
                >
                    Refresh
                </Button>
            </div>

            <Table
                columns={columns}
                dataSource={sellers}
                loading={loading}
                rowKey="id"
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} sellers`,
                    position: ['bottomCenter']
                }}
                onChange={handleTableChange}
                className="border border-gray-200 rounded"
                scroll={{ x: 'max-content' }}
            />
        </Card>
    );
};

export default SellerManagement;
