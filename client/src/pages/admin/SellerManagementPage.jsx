import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate, useNavigate } from 'react-router-dom';
import { Table, Space, Button, Input, Card, Typography, Tooltip, Modal, message, Select } from 'antd';
import { fetchSellers, activateSeller, deactivateSeller } from '../../redux/actions/admin/sellerManagementAction';
import { setSellersPagination } from '../../redux/reducers/admin/sellerReducer';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {
    SearchOutlined,
    EyeOutlined,
    EditOutlined,
    StopOutlined,
    ExclamationCircleOutlined,
    RedoOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { confirm } = Modal;
const { Option } = Select;

const SellerManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const { data: sellers, loading, pagination } = useSelector((state) => state.admin.sellers);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'active', or 'inactive'

    useEffect(() => {
        loadSellers();
    }, [pagination.current, pagination.pageSize, searchText]);

    const loadSellers = () => {
        dispatch(
            fetchSellers({
                axiosInstance: axiosPrivate,
                page: pagination.current,
                limit: pagination.pageSize,
                search: searchText,
            })
        );
    };

    const handleTableChange = (pagination) => {
        dispatch(setSellersPagination(pagination));
    };

    const handleSellerStatusChange = async (seller, isActive) => {
        const action = isActive ? deactivateSeller : activateSeller;
        const successMessage = isActive ? 'Deactivated seller successfully' : 'Activated seller successfully';

        try {
            await dispatch(
                action({
                    sellerId: seller.id,
                    axiosInstance: axiosPrivate,
                })
            ).unwrap();

            message.success(successMessage);
            loadSellers();
        } catch (error) {
            message.error(error.message || `Failed to ${isActive ? 'deactivate' : 'activate'} seller`);
        }
    };

    const showStatusConfirm = (seller, isActive) => {
        confirm({
            title: `${isActive ? 'Deactivate' : 'Activate'} Seller`,
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} "${seller.name}"?`,
            okText: 'Yes',
            okType: isActive ? 'danger' : 'primary',
            cancelText: 'No',
            onOk: () => handleSellerStatusChange(seller, isActive),
        });
    };

    const handleEdit = (record) => {
        navigate(`/admin/seller-management/${record.id}/edit`);
    };

    const handleView = (record) => {
        navigate(`/admin/seller-management/${record.id}`);
    };

    const getRowClassName = (record) => {
        return !record.is_active ? 'opacity-50 select-none' : '';
    };

    // Filter sellers based on statusFilter
    const filteredSellers = sellers?.filter(seller => {
        switch (statusFilter) {
            case 'active':
                return seller.is_active;
            case 'inactive':
                return !seller.is_active;
            default:
                return true;
        }
    });

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
            title: 'Avatar',
            key: 'icon',
            width: '80px',
            render: (_, record) => (
                <div className={!record.is_active ? 'blur-[2px]' : ''}>
                    <img
                        src={record.icon}
                        alt={record.name}
                        className="w-10 h-10 rounded-full object-cover border border-gray-200"
                    />
                </div>
            ),
        },
        {
            title: 'Tên shop',
            key: 'name',
            render: (_, record) => (
                <Space direction="vertical" size={1}>
                    <Text strong>{record.name}</Text>
                    {record.isOfficial && (
                        <Text type="success" className="text-xs">
                            Official Store
                        </Text>
                    )}
                    {!record.is_active && (
                        <Text type="danger" className="text-xs">
                            Deactivated
                        </Text>
                    )}
                </Space>
            ),
        },
        {
            title: 'Rating',
            dataIndex: 'avg_rating_point',
            key: 'avg_rating_point',
            width: '100px',
            render: (avg_rating_point) => (
                <Text>
                    {avg_rating_point ? `${Number(avg_rating_point).toFixed(1)} ⭐` : 'No rating'}
                </Text>
            ),
            sorter: (a, b) => (a.rating || 0) - (b.rating || 0),
        },
        {
            title: 'Đánh giá',
            dataIndex: 'review_count',
            key: 'review_count',
            width: '100px',
            render: (count) => (
                <Text>{count.toLocaleString()}</Text>
            ),
            sorter: (a, b) => a.review_count - b.review_count,
        },
        {
            title: 'Lượt theo dõi',
            dataIndex: 'total_follower',
            key: 'total_follower',
            width: '100px',
            render: (count) => (
                <Text>{count.toLocaleString()}</Text>
            ),
            sorter: (a, b) => a.total_follower - b.total_follower,
        },
        {
            title: 'Hành động',
            key: 'actions',
            width: '150px',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View Store">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => navigate(`/admin/seller-management/${record.id}`)}
                            className="text-blue-600 p-0 hover:text-blue-800"
                            disabled={!record.is_active}
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            className="text-green-600 p-0 hover:text-green-800"
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Tooltip title={record.is_active ? 'Deactivate' : 'Activate'}>
                        <Button
                            type="link"
                            icon={record.is_active ? <StopOutlined /> : <RedoOutlined />}
                            onClick={() => showStatusConfirm(record, record.is_active)}
                            className={record.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'}
                        />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return (
        <Card title="Seller Management" className="shadow-md">
            <div className="mb-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Input
                        placeholder="Search sellers..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        onPressEnter={loadSellers}
                        className="w-64"
                    />
                    <Space align="center">
                        <Text>Status:</Text>
                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            className="w-32"
                        >
                            <Option value="all">All</Option>
                            <Option value="active">Active</Option>
                            <Option value="inactive">Inactive</Option>
                        </Select>
                    </Space>
                </div>
                <Button
                    type="primary"
                    onClick={loadSellers}
                    icon={<RedoOutlined />}
                >
                    Tải lại
                </Button>
            </div>
            <Table
                columns={columns}
                dataSource={filteredSellers}
                loading={loading}
                rowKey="id"
                rowClassName={getRowClassName}
                pagination={{
                    ...pagination,
                    total: filteredSellers?.length,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Tổng cộng ${total} shop`,
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