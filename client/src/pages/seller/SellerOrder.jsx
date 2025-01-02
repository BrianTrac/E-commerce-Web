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
        message.error(err.message || 'Failed to load orders');
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
      message.error(err.message || 'Failed to update order status');
    }
  };

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
    },
    {
      title: 'Customer',
      dataIndex: 'User',
      key: 'User',
      render: (user) => (
        <>
          <Text strong>{user.username}</Text>
          <br />
          <Text type="secondary">{user.email}</Text>
        </>
      ),
    },
    {
      title: 'Total Price',
      dataIndex: 'total_price',
      key: 'total_price',
      render: (price) => <Text style={{ color: 'green' }}>{Number(price).toLocaleString()} VND</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        const color =
          status === 'pending'
            ? 'orange'
            : status === 'processing'
            ? 'green'
            : status === 'cancelled'
            ? 'red'
            : 'blue';
        return <Tag color={color}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) =>
        record.status === 'pending' ? (
          <div style={{ display: 'flex', gap: '10px' }}>
            <Button
              type="primary"
              onClick={() => handleStatusUpdate(record.id, 'processing')} // Map Accept to processing
              style={{ backgroundColor: 'green', borderColor: 'green' }}
            >
              Accept
            </Button>
            <Button
              type="primary"
              danger
              onClick={() => handleStatusUpdate(record.id, 'cancelled')} // Map Deny to cancelled
            >
              Deny
            </Button>
          </div>
        ) : (
          <Text type="secondary">No actions available</Text>
        ),
    },
  ];

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
      <Title level={3}>Seller Orders</Title>

      {/* Status Filter Buttons */}
      <Space>
        <Button
          type={!statusFilter ? 'primary' : 'default'}
          onClick={() => handleStatusFilter('')}
        >
          All
        </Button>
        <Button
          type={statusFilter === 'processing' ? 'primary' : 'default'}
          onClick={() => handleStatusFilter('processing')}
        >
          Processing
        </Button>
        <Button
          type={statusFilter === 'pending' ? 'primary' : 'default'}
          onClick={() => handleStatusFilter('pending')}
        >
          Pending
        </Button>
        <Button
          type={statusFilter === 'cancelled' ? 'primary' : 'default'}
          onClick={() => handleStatusFilter('cancelled')}
        >
          Cancelled
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
              <Divider orientation="left">Order Items</Divider>
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
                          <Text type="secondary">Price: {Number(item.Product.price).toLocaleString()} VND</Text>
                        </div>
                      }
                      description={
                        <>
                          <Text>Quantity: {item.quantity}</Text>
                          <br />
                          <Text>Total: {Number(item.quantity * item.price).toLocaleString()} VND</Text>
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
