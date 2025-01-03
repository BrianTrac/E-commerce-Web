import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {Table, Space, Button, Input, Card, Typography, Tooltip, Modal, message, Select} from 'antd';
import { fetchUsers, activateUser, deactivateUser } from '../../redux/actions/admin/userManagementAction';
import { setUsersPagination } from '../../redux/reducers/admin/userReducer';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {
    EyeOutlined,
    EditOutlined,
    StopOutlined,
    ExclamationCircleOutlined,
    RedoOutlined, SearchOutlined
} from '@ant-design/icons';

const { Text } = Typography;
const { confirm } = Modal;

const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const { data: users, loading, pagination } = useSelector((state) => state.admin.users);
    const [searchText, setSearchText] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');

    useEffect(() => {
        loadUsers();
    }, [pagination.current, pagination.pageSize, searchText]);

    const loadUsers = () => {
        dispatch(
            fetchUsers({
                axiosInstance: axiosPrivate,
                page: pagination.current,
                limit: pagination.pageSize,
                search: searchText,
            })
        )
    };

    const filteredUsers = users?.filter(user => {
        switch (statusFilter) {
            case 'active':
                return user.is_active;
            case 'inactive':
                return !user.is_active;
            default:
                return true;
        }
    });

    const handleTableChange = (pagination) => {
        dispatch(setUsersPagination(pagination));
    };

    const handleUserStatusChange = async (user, isActive) => {
        const action = isActive ? deactivateUser : activateUser;
        const successMessage = isActive ? 'Deactivated user successfully' : 'Activated user successfully';

        try {
            await dispatch(
                action({
                    userId: user.id,
                    axiosInstance: axiosPrivate,
                })
            ).unwrap();

            message.success(successMessage);
            loadUsers();
        } catch (error) {
            message.error(error.message || `Failed to ${isActive ? 'deactivate' : 'activate'} user`);
        }
    };

    const showStatusConfirm = (user, isActive) => {
        confirm({
            title: `${isActive ? 'Deactivate' : 'Activate'} User`,
            icon: <ExclamationCircleOutlined />,
            content: `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} "${user.username}"?`,
            okText: 'Yes',
            okType: isActive ? 'danger' : 'primary',
            cancelText: 'No',
            onOk: () => handleUserStatusChange(user, isActive),
        });
    };

    const handleEdit = (record) => {
        console.log('Edit user:', record);
        // Add your edit logic here
    };

    const handleView = (record) => {
        navigate(`/admin/user-management/${record.id}`);
    };

    const getRowClassName = (record) => {
        return !record.is_active ? 'opacity-50 select-none' : '';
    };

    const columns = [
        {
            title: 'User Info',
            key: 'userInfo',
            render: (_, record) => (
                <Space direction="vertical" size={1}>
                    <Text strong>{record.username}</Text>
                    <Text type="secondary">{record.email}</Text>
                </Space>
            ),
        },
        {
            title: 'Status',
            key: 'status',
            render: (_, record) => (
                <Text type={record.is_active ? 'success' : 'danger'}>
                    {record.is_active ? 'Active' : 'Inactive'}
                </Text>
            ),
        },
        {
            title: 'Join Date',
            key: 'joinDate',
            dataIndex: 'createdAt',
            render: (createdAt) => (
                <Text>{new Date(createdAt).toLocaleDateString()}</Text>
            ),
        },
        {
            title: 'Actions',
            key: 'actions',
            render: (_, record) => (
                <Space size="middle">
                    <Tooltip title="View">
                        <Button
                            type="link"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                            className="text-blue-600 hover:text-blue-800"
                        />
                    </Tooltip>
                    <Tooltip title="Edit">
                        <Button
                            type="link"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                            className="text-green-600 hover:text-green-800"
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
        <Card title="User Management" className="shadow-md">
            {/* Action Bar */}
            <div className="bg-white p-4 rounded-lg shadow mb-6">
                <div className="flex items-center space-x-4">
                    {/* Search */}
                    <Input
                        placeholder="Search users..."
                        prefix={<SearchOutlined />}
                        value={searchText}
                        onChange={e => setSearchText(e.target.value)}
                        onPressEnter={loadUsers}
                        className="w-64"
                    />
                    {/* Filter Button */}
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
            </div>

            {/* Search and Refresh buttons remain the same */}
            <Table
                columns={columns}
                dataSource={filteredUsers}
                loading={loading}
                rowKey="id"
                rowClassName={getRowClassName}
                pagination={{
                    ...pagination,
                    showSizeChanger: true,
                    showQuickJumper: true,
                    showTotal: (total) => `Total ${total} user`,
                    position: ['bottomCenter']
                }}
                onChange={handleTableChange}
                className="border border-gray-200 rounded"
                scroll={{x: 'max-content'}}
            />
        </Card>
    );
}

export default UserManagement;
