import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Table, Space, Button, Input, Card, Typography, Tooltip, Modal, message } from 'antd';
import { fetchUsers, activateUser, deactivateUser } from '../../redux/actions/admin/userManagementAction';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import {
    EyeOutlined,
    EditOutlined,
    StopOutlined,
    ExclamationCircleOutlined,
    RedoOutlined
} from '@ant-design/icons';

import {
    Search,
    Plus,
    Edit,
    Trash2,
    Eye,
    Filter,
    Download,
    Upload
} from 'lucide-react';

const { Text } = Typography;
const { confirm } = Modal;

const UserManagement = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const axiosPrivate = useAxiosPrivate();

    const { data: users, loading, pagination } = useSelector((state) => state.admin.users);
    const [searchText, setSearchText] = useState('');

    useEffect(() => {
        loadUsers();
    }, [pagination.current, pagination.pageSize]);

    const loadUsers = () => {
        dispatch(
            fetchUsers({
                axiosInstance: axiosPrivate,
                page: pagination.current,
                limit: pagination.pageSize,
            })
        )
    };

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
        // {
        //     title: 'Total Purchases',
        //     key: 'totalPurchases',
        //     dataIndex: 'totalPurchases', // Assuming this field exists in the API response
        //     render: (totalPurchases) => (
        //         <Text>{totalPurchases?.toLocaleString() || '0'}</Text>
        //     ),
        // },
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
                    <div className="relative">
                        <input
                            type="text"
                            placeholder="Search users..."
                            className="pl-10 pr-4 py-2 border rounded-lg w-64 focus:outline-none focus:border-blue-500"
                        />
                        <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400"/>
                    </div>
                    {/* Filter Button */}
                    <button className="flex items-center space-x-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
                        <Filter className="w-4 h-4"/>
                        <span>Filters</span>
                    </button>
                </div>
            </div>

            {/* Search and Refresh buttons remain the same */}
            <Table
                columns={columns}
                dataSource={users}
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

const UserManagement2 = () => {
    // Sample data - replace with your actual data
    const [users] = useState([
        {
            id: 1,
            name: "John Doe",
            email: "john.doe@example.com",
            phone: "+1 234-567-8900",
            status: "Active",
            joinDate: "2024-03-10",
            totalPurchases: 150
        },
        {
            id: 2,
            name: "Jane Smith",
            email: "jane.smith@example.com",
            phone: "+1 234-567-8901",
            status: "Inactive",
            joinDate: "2024-04-20",
            totalPurchases: 90
        },
        // Add more sample data as needed
    ]);

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">User Management</h1>
                <p className="text-gray-600">Manage and monitor all users on your platform</p>
            </div>


            {/* Users Table */}
            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">User Info</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Status</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Join Date</th>
                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Total Purchases</th>
                            <th className="px-6 py-4 text-right text-sm font-semibold text-gray-600">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4">
                                    <div className="flex items-center">
                                        <img
                                            src="/api/placeholder/40/40"
                                            alt={user.name}
                                            className="w-10 h-10 rounded-full mr-3"
                                        />
                                        <div>
                                            <div className="font-medium text-gray-900">{user.name}</div>
                                            <div className="text-sm text-gray-500">{user.email}</div>
                                            <div className="text-sm text-gray-500">{user.phone}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 text-sm rounded-full ${user.status === 'Active'
                                        ? 'bg-green-100 text-green-800'
                                        : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.joinDate}</td>
                                <td className="px-6 py-4 text-sm text-gray-900">{user.totalPurchases}</td>
                                <td className="px-6 py-4 text-right space-x-3">
                                    <button className="text-gray-400 hover:text-gray-500">
                                        <Eye className="w-5 h-5" />
                                    </button>
                                    <button className="text-gray-400 hover:text-gray-500">
                                        <Edit className="w-5 h-5" />
                                    </button>
                                    <button className="text-gray-400 hover:text-red-500">
                                        <Trash2 className="w-5 h-5" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {/* Pagination */}
                <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                        Showing 1 to 10 of 20 results
                    </div>
                    <div className="flex space-x-2">
                        <button className="px-4 py-2 border rounded hover:bg-gray-50">Previous</button>
                        <button className="px-4 py-2 border rounded bg-blue-600 text-white">1</button>
                        <button className="px-4 py-2 border rounded hover:bg-gray-50">2</button>
                        <button className="px-4 py-2 border rounded hover:bg-gray-50">Next</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserManagement;
