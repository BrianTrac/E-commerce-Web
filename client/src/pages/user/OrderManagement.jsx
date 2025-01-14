import React, { useState, useEffect } from 'react';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { useSelector } from 'react-redux';
import { selectAuth } from '../../redux/reducers/user/authReducer';
import { getUserByEmail } from '../../redux/services/user/userService';

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [orders, setOrders] = useState([]);
  const [hoveredOrder, setHoveredOrder] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const axiosPrivate = useAxiosPrivate();
  const { user } = useSelector(selectAuth);

  const tabs = [
    { id: 'all', label: 'Tất cả đơn' },
    { id: 'pending', label: 'Chờ thanh toán' },
    { id: 'processing', label: 'Đang xử lý' },
    { id: 'delivered', label: 'Đã giao' },
    { id: 'cancelled', label: 'Đã hủy' },
  ];

  useEffect(() => {
    fetchOrders(currentPage, activeTab);
  }, [currentPage, activeTab]);

  const fetchOrders = async (page, status) => {
    setLoading(true);
    try {
      const responseUser = await getUserByEmail(axiosPrivate, user.email);
      const response = await axiosPrivate.get(`/api/orders/user/${responseUser.id}`, {
        params: { page, limit: 10, status },
      });
      const { data } = response.data;
      setOrders(data.rows);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (tabId) => {
    setActiveTab(tabId);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-medium mb-6">Đơn hàng của tôi</h1>

        {/* Tabs */}
        <div className="flex space-x-6 border-b mb-6">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`pb-4 px-2 ${activeTab === tab.id ? 'border-b-2 border-blue-500 text-blue-500' : 'text-gray-500'}`}
              onClick={() => handleTabChange(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>
        
        {/* Orders List */}
        <div className="space-y-4">
          {loading ? (
            <p>Loading...</p>
          ) : (
            orders.map((order) => (
              <div
                key={order.id}
                className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
                onMouseEnter={() => setHoveredOrder(order.id)}
                onMouseLeave={() => setHoveredOrder(null)}
              >
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <p className="font-medium text-lg">Order ID: {order.id}</p>
                    <p className="text-sm text-gray-500">Trạng thái: {order.status}</p>
                    <p className="text-sm text-gray-500">Ngày đặt: {new Date(order.created_at).toLocaleDateString()}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-lg">{parseFloat(order.total_amount).toLocaleString()} VND</p>
                  </div>
                </div>
                <div className="space-y-2">
                  {order.orderItems.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 border-t pt-4">
                      <img
                        src={item.product.thumbnail_url || '/placeholder.png'}
                        alt={item.product.name}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h3 className="font-medium">{item.product.name}</h3>
                        <p className="text-sm text-gray-500">Số lượng: {item.quantity}</p>
                        <p className="text-sm text-gray-500">Giá: {parseFloat(item.price).toLocaleString()} VND</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Pagination */}
        <div className="flex justify-center mt-6 space-x-2">
          {Array.from({ length: totalPages }, (_, index) => (
            <button
              key={index}
              className={`px-4 py-2 rounded ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'}`}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;
