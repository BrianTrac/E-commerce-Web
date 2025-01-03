import React, { useEffect, useState } from 'react';
import { Table, Tag, Avatar, Typography, List, Divider, Button, message, Space } from 'antd';
import { getOrders, updateOrderStatus } from '../../service/seller/orderApi';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const { Title, Text } = Typography;

const SellerOrder = () => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [statusFilter, setStatusFilter] = useState(''); // Default to show all
  const [loading, setLoading] = useState(true);
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await getOrders(axiosPrivate);
        setOrders(response.orders);
        setFilteredOrders(response.orders); // Show all orders by default
      } catch (err) {
        message.error('Lỗi khi lấy danh sách đơn hàng');
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, [axiosPrivate]);

  const handleStatusFilter = (status) => {
    setStatusFilter(status);
    if (status) {
      setFilteredOrders(orders.filter((order) => order.status === status));
    } else {
      setFilteredOrders(orders); // Show all orders when no filter
    }
  };

  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      const response = await updateOrderStatus(axiosPrivate, orderId, newStatus);
      message.success(response.message);
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      setOrders(updatedOrders);
      handleStatusFilter(statusFilter); // Apply current filter after status update

      // Load lại trang sau 1s
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err) {
      message.error('Lỗi khi cập nhật trạng thái đơn hàng');
    }
  };

  const columns = [
    {
      title: 'Mã đơn hàng',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Khách hàng',
      dataIndex: 'User',
      key: 'User',
      render: (user) => (
        <>
          <Text strong>{user.username}</Text>
        </>
      ),
    },
    {
      title: 'Tổng tiền',
      dataIndex: 'total_amount',
      key: 'total_amount',
      render: (price) => <Text style={{ color: 'green' }}>{Number(price).toLocaleString()} VND</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        let color = '';
        let text = '';
        switch (status) {
          case 'pending':
            color = 'orange';
            text = 'Chờ duyệt';
            break;
          case 'processing':
            color = 'green';
            text = 'Đang vận chuyển';
            break;
          case 'cancelled':
            color = 'red';
            text = 'Đã hủy';
            break;
          default:
            color = 'blue';
            text = 'Không xác định';
        }
        return <Tag color={color}>{text}</Tag>;
      },
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'created_at',
      key: 'created_at',
      render: (created_at) => {
        const date = new Date(created_at);
        const formattedDate = date.toLocaleDateString('en-GB'); // Format as dd/mm/yyyy
        const formattedTime = date.toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
        }); // Format as HH:mm
        return (
          <Text>
            {formattedDate} {formattedTime}
          </Text>
        );
      },
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (_, record) =>
        record.status === 'pending' ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              type="primary"
              onClick={() => handleStatusUpdate(record.id, 'processing')} // Map Accept to processing
              style={{ backgroundColor: 'green', borderColor: 'green' }}
            >
              Chấp nhận
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => handleStatusUpdate(record.id, 'cancelled')} // Map Deny to cancelled
            >
              Từ chối
            </Button>
          </div>
        ) : (
          <Text type="secondary">Không thể thực hiện hành động</Text>
        ),
    },
  ];

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
      <Title level={3}>Đơn hàng</Title>

      {/* Status Filter Buttons */}
      <Space>
        <Button
          type={!statusFilter ? 'primary' : 'default'}
          onClick={() => handleStatusFilter('')}
        >
          Tất cả
        </Button>
        <Button
          type={statusFilter === 'processing' ? 'primary' : 'default'}
          onClick={() => handleStatusFilter('processing')}
        >
          Đang vận chuyển
        </Button>
        <Button
          type={statusFilter === 'pending' ? 'primary' : 'default'}
          onClick={() => handleStatusFilter('pending')}
        >
          Chờ duyệt
        </Button>
        <Button
          type={statusFilter === 'cancelled' ? 'primary' : 'default'}
          onClick={() => handleStatusFilter('cancelled')}
        >
          Đã hủy
        </Button>
      </Space>

      {/* Orders Table */}
      <Table
        dataSource={filteredOrders}
        columns={columns}
        rowKey="id"
        loading={loading}
        expandable={{
          expandedRowRender: (record) => (
            <>
              <Divider orientation="left">Quản lý đơn hàng</Divider>
              <List
                dataSource={record.OrderItems}
                bordered
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<Avatar src={item.Product.thumbnail_url} />}
                      title={
                        <div>
                          <Text strong>{item.Product.name}</Text>
                          <br />
                          <Text type="secondary">Giá: {Number(item.Product.price).toLocaleString()} VND</Text>
                        </div>
                      }
                      description={
                        <>
                          <Text>Số lượng: {item.quantity}</Text>
                          <br />
                          <Text>Tổng tiền: {Number(item.quantity * item.price).toLocaleString()} VND</Text>
                        </>
                      }
                    />
                  </List.Item>
                )}
              />
            </>
          ),
        }}
      />
    </div>
  );
};

export default SellerOrder;
