import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Space, Button, Input, Card, Typography, Tooltip, Modal, message } from 'antd';
import { fetchSellers, activateSeller, deactivateSeller } from '../../redux/actions/admin/sellerManagementAction';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {
    EyeOutlined,
    EditOutlined,
    StopOutlined,
    ExclamationCircleOutlined,
    RedoOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { confirm } = Modal;

const SellerManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const { data: sellers, loading, pagination } = useSelector((state) => state.admin.sellers);
    const [searchText, setSearchText] = useState('');

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
        console.log('Edit seller:', record);
        // Add your edit logic here
    };

    const handleView = (record) => {
        navigate(`/admin/seller-management/${record.id}`);
    };

    const getRowClassName = (record) => {
        return !record.is_active ? 'opacity-50 select-none' : '';
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
            title: 'Reviews',
            dataIndex: 'review_count',
            key: 'review_count',
            width: '100px',
            render: (count) => (
                <Text>{count.toLocaleString()}</Text>
            ),
            sorter: (a, b) => a.review_count - b.review_count,
        },
        {
            title: 'Followers',
            dataIndex: 'total_follower',
            key: 'total_follower',
            width: '100px',
            render: (count) => (
                <Text>{count.toLocaleString()}</Text>
            ),
            sorter: (a, b) => a.total_follower - b.total_follower,
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
            {/* Search and Refresh buttons remain the same */}
            <Table
                columns={columns}
                dataSource={sellers}
                loading={loading}
                rowKey="id"
                rowClassName={getRowClassName}
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
