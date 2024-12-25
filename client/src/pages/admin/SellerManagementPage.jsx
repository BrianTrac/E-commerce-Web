import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Space, Button, Input, Card, Typography } from 'antd';
import { SearchOutlined, RedoOutlined } from '@ant-design/icons';
import { fetchSellers, setSellersPagination } from '../../redux/reducers/admin';

const { Text } = Typography;

const SellerManagement = () => {
    const dispatch = useDispatch();
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
            title: 'Store',
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
            title: '',
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
            width: '120px',
            render: (_, record) => (
                <Button
                    type="primary"
                    size="small"
                    onClick={() => window.open(record.url, '_blank')}
                >
                    View Store
                </Button>
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