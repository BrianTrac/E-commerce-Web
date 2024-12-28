import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Card, Space, Input, Tooltip, Button, Typography } from 'antd';
import { fetchProducts, setProductsPagination } from '../../redux/reducers/seller';
import {
  EyeOutlined,
  EditOutlined,
  DeleteOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Text } = Typography;

const ProductManagement = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { data: products, loading, pagination } = useSelector(state => state.seller.products);
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    loadProducts();
  }, [pagination.current, pagination.pageSize]);

  const loadProducts = () => {
    dispatch(fetchProducts({
      page: pagination.current,
      limit: pagination.pageSize,
      search: searchText,
    }));
  };

  const handleSearch = () => {
    dispatch(
      setProductsPagination({
        current: 1,
      })
    );
    loadProducts();
  };

  const handleView = (record) => {
    navigate(`/seller/product-management/detail/${record.id}`);
  };

  const handleAddProduct = () => {
    navigate('/seller/product-management/add');
  };

  const handleTableChange = (pagination) => {
    dispatch(setProductsPagination(pagination));
  };

  const columns = [
    {
      title: 'No.',
      key: 'index',
      width: '60px',
      render: (_, __, index) => (
        <Text>{(pagination.current - 1) * pagination.pageSize + index + 1}</Text>
      ),
    },
    {
      title: 'Image',
      key: 'image',
      width: '80px',
      render: (_, record) => (
        <img
          src={record.thumbnails[0] || ''}
          alt={record.name}
          className="w-10 h-10 object-cover border border-gray-200 rounded"
        />
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      width: '400px',
      key: 'name',
    },
    {
      title: 'Category Name',
      dataIndex: 'category',
      width: '250px',
      key: 'category',
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      render: (price) =>
        price
          ? `${new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(Number(price))}`
          : 'N/A',
    },
    {
      title: 'Rating',
      dataIndex: 'rating',
      key: 'rating',
      render: (rating) => (typeof rating === 'number' ? `${rating.toFixed(1)} ⭐` : 'No rating'),
      sorter: (a, b) => (a.rating || 0) - (b.rating || 0),
    },
    {
      title: 'Qty',
      dataIndex: 'qty',
      key: 'qty',
      sorter: (a, b) => a.qty - b.qty,
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
              onClick={() => showDeleteConfirm(record)}
              className="text-red-600 p-0 hover:text-red-800"
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <Card title="Product Management" className="shadow-md">
      <div className="mb-4 flex justify-between items-center">
        <div className='flex'>
          <Input
            placeholder="Search products..."
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
            onPressEnter={handleSearch}
            className="w-64 mr-2"
          />
          <Button type="primary" onClick={handleSearch}>Search</Button>
        </div>

        <Button
          type="primary"
          onClick={handleAddProduct}
          style={{ marginLeft: '10px' }}
        >
          Add New Product
        </Button>
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
        className="border border-gray-200 rounded"
        scroll={{ x: 'max-content' }}
      />

    </Card>
  );
};

export default ProductManagement;
