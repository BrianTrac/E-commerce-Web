// pages/admin/SellerManagementPage.jsx
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Tag, Space, Button, Input, Card, Select, Modal } from 'antd';
import { SearchOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { fetchSellers, updateSellerStatus, setSellersPagination } from '../../redux/reducers/admin';
import { toast } from 'react-toastify';

const { confirm } = Modal;

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

    const handleStatusChange = (sellerId, newStatus) => {
        confirm({
            title: 'Are you sure you want to change this seller\'s status?',
            icon: <ExclamationCircleOutlined />,
            content: 'This action will update the seller\'s account status',
            onOk() {
                dispatch(updateSellerStatus({ sellerId, status: newStatus }));
            }
        });
    };

    const columns = [
        {
            title: 'Store Info',
            dataIndex: 'storeName',
            key: 'storeName',
            render: (text, record) => (
                <Space direction="vertical">
                    <span className="font-medium">{text}</span>
                    <span className="text-gray-500">{record.email}</span>
                </Space>
            ),
        },
        {
            title: 'Owner',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Products',
            dataIndex: 'products',
            key: 'products',
            sorter: true,
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (status, record) => (
                <Select
                    value={status}
                    onChange={(value) => handleStatusChange(record.id, value)}
                    style={{ width: 120 }}
                >
                    <Select.Option value="active">Active</Select.Option>
                    <Select.Option value="pending">Pending</Select.Option>
                    <Select.Option value="suspended">Suspended</Select.Option>
                </Select>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space>
                    <Button type="primary" onClick={() => handleViewDetails(record)}>
                        View Details
                    </Button>
                    <Button onClick={() => handleViewProducts(record)}>
                        View Products
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <Card title="Seller Management">
            <div className="mb-4 flex justify-between">
                <Input
                    placeholder="Search sellers..."
                    prefix={<SearchOutlined />}
                    value={searchText}
                    onChange={e => setSearchText(e.target.value)}
                    onPressEnter={loadSellers}
                    style={{ width: 300 }}
                />
                <Button type="primary" onClick={() => loadSellers()}>
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
                    showTotal: (total) => `Total ${total} sellers`
                }}
                onChange={handleTableChange}
            />
        </Card>
    );
};

export default SellerManagement;