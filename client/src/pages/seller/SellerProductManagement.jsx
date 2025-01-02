import React, { useEffect, useState } from 'react';
import { Table, Card, Space, Input, Tooltip, Button, Typography, Modal, message, Checkbox } from 'antd';
import { EyeOutlined, EditOutlined, DeleteOutlined, ExclamationCircleOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { deleteMultipleProductsById, deleteProductById, getProductsByStatus } from '../../service/seller/productApi';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const { confirm } = Modal;
const { Text } = Typography;

const SellerProductManagement = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10, total: 0 });
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sorter, setSorter] = useState({ field: '', order: '' });
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    loadProducts();
  }, [pagination.current, statusFilter, sorter]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const response = await getProductsByStatus(
        axiosPrivate,
        statusFilter,
        pagination.current,
        pagination.pageSize,
        searchText,
        sorter.field,
        sorter.order
      );
      setProducts(response.data);
      setPagination({ ...pagination, total: response.total });
    } catch (error) {
      message.error(error.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    setPagination({ ...pagination, current: 1 });
    loadProducts();
  };

  const handleStatusClick = (status) => {
    setStatusFilter(status);
    setPagination({ ...pagination, current: 1 });
  };

  const handleTableChange = (pagination, filters, sorter) => {
    setPagination({ ...pagination, current: pagination.current });
    setSorter({
      field: sorter.field,
      order: sorter.order === 'ascend' ? 'ASC' : sorter.order === 'descend' ? 'DESC' : '',
    });
  };

  const handleView = (product) => {
    navigate(`/seller/product-management/detail/${product.id}`);
  };

  const handleEdit = (product) => {
    navigate(`/seller/product-management/edit/${product.id}`);
  };

  const handleDeleteMultiple = async (ids) => {
    confirm({
      title: `Are you sure you want to delete ${ids.length} selected product(s)?`,
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteMultipleProductsById(axiosPrivate, ids);
          message.success('Selected products deleted successfully');
          setSelectedRowKeys([]);
          loadProducts();
        } catch (error) {
          message.error(error.message || 'Failed to delete products');
        }
      },
    });
  };

  const handleDelete = (id) => {
    confirm({
      title: 'Are you sure you want to delete this product?',
      icon: <ExclamationCircleOutlined />,
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: async () => {
        try {
          await deleteProductById(axiosPrivate, id);
          message.success('Product deleted successfully');
          loadProducts();
        } catch (error) {
          message.error(error.message || 'Failed to delete product');
        }
      },
    });
  };

  const columns = [
    {
      title: <Checkbox
        indeterminate={selectedRowKeys.length > 0 && selectedRowKeys.length < products.length}
        checked={selectedRowKeys.length === products.length}
        onChange={(e) => setSelectedRowKeys(e.target.checked ? products.map((item) => item.id) : [])}
      />,
      dataIndex: 'checkbox',
      width: '50px',
      render: (_, record) => (
        <Checkbox
          checked={selectedRowKeys.includes(record.id)}
          onChange={(e) => {
            const selected = e.target.checked
              ? [...selectedRowKeys, record.id]
              : selectedRowKeys.filter((key) => key !== record.id);
            setSelectedRowKeys(selected);
          }}
        />
      ),
    },
    {
      title: 'No.',
      key: 'index',
      width: '60px',
      render: (_, __, index) => <Text>{(pagination.current - 1) * pagination.pageSize + index + 1}</Text>,
    },
    {
      title: 'Image',
      key: 'image',
      width: '80px',
      render: (_, record) => (
        <img src={record.thumbnails[0] || ''} alt={record.name} className="w-10 h-10 object-cover border rounded" />
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      width: '350px',
      sorter: true,
    },
    {
      title: 'Category Name',
      dataIndex: 'category',
      key: 'category',
      width: '250px',
      sorter: true,
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      sorter: true,
      render: (rating) =>
        rating !== undefined && rating !== null ? `${parseFloat(rating).toFixed(1)} ⭐` : 'No rating',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: true,
      render: (price) =>
        price
          ? `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price))}`
          : 'N/A',
    },
    {
      title: 'Status',
      dataIndex: 'inventory_status',
      key: 'status',
      render: (status) => (
        <span
          className={
            status === 'pending' ? 'text-orange-500' : status === 'suspend' ? 'text-red-500' : 'text-green-500'
          }
        >
          {status === 'pending' ? 'Pending' : status === 'suspend' ? 'Suspend' : 'Available'}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: '100px',
      render: (_, record) => (
        <Space size="middle">
          <Tooltip title="View Product">
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
              onClick={() => handleDelete(record.id)}
              className="text-red-600 p-0 hover:text-red-800"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <div className="flex justify-between items-center">
          <span>Product Management</span>
          <Button type="default" icon={<ReloadOutlined />} onClick={loadProducts}>
            Refresh
          </Button>
        </div>
      }
      className="shadow-md"
    >
      <div className="mb-4 flex justify-between items-center">
        <Input.Search
          placeholder="Search products..."
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          onSearch={handleSearch}
          style={{ width: 300 }}
        />
        <div className="flex space-x-2">
          <Button type={statusFilter === '' ? 'primary' : 'default'} onClick={() => handleStatusClick('')}>
            All
          </Button>
          <Button type={statusFilter === 'available' ? 'primary' : 'default'} onClick={() => handleStatusClick('available')}>
            Available
          </Button>
          <Button type={statusFilter === 'pending' ? 'primary' : 'default'} onClick={() => handleStatusClick('pending')}>
            Pending
          </Button>
          <Button type={statusFilter === 'suspend' ? 'primary' : 'default'} onClick={() => handleStatusClick('suspend')}>
            Suspend
          </Button>
        </div>
        <Space>
          {selectedRowKeys.length > 0 && (
            <Button
              type="primary"
              onClick={() => handleDeleteMultiple(selectedRowKeys)}
            >
              Delete ({selectedRowKeys.length})
            </Button>
          )}
          <Button type="primary" onClick={() => navigate('/seller/product-management/add')}>
            Add New Product
          </Button>
        </Space>
      </div>

      <Table
        columns={columns}
        dataSource={products}
        loading={loading}
        rowKey="id"
        pagination={{
          ...pagination,
          showSizeChanger: true,
          showQuickJumper: true,
          showTotal: (total) => `Total ${total} products`,
          position: ['bottomCenter'],
        }}
        onChange={handleTableChange}
      />
    </Card>
  );
};

export default SellerProductManagement;
