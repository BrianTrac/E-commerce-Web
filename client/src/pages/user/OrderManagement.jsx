import React, { useState } from 'react';
import { Book, Bell, ShoppingBag, RefreshCcw, MapPin, CreditCard, Star, Heart, Share2, Shield, Clock, Tag, Gift, HelpCircle } from 'lucide-react';

const OrderManagement = () => {
  const [activeTab, setActiveTab] = useState('all');
  const [hoveredOrder, setHoveredOrder] = useState(null);

  const tabs = [
    { id: 'all', label: 'Tất cả đơn' },
    { id: 'pending', label: 'Chờ thanh toán' },
    { id: 'processing', label: 'Đang xử lý' },
    { id: 'shipping', label: 'Đang vận chuyển' },
    { id: 'delivered', label: 'Đã giao' },
    { id: 'cancelled', label: 'Đã hủy' }
  ];

  const sidebarItems = [
    { icon: <Bell className="w-5 h-5" />, label: 'Thông báo của tôi' },
    { icon: <ShoppingBag className="w-5 h-5" />, label: 'Quản lý đơn hàng' },
    { icon: <RefreshCcw className="w-5 h-5" />, label: 'Quản lý đổi trả' },
    { icon: <MapPin className="w-5 h-5" />, label: 'Số địa chỉ' },
    { icon: <CreditCard className="w-5 h-5" />, label: 'Thông tin thanh toán' },
    { icon: <Star className="w-5 h-5" />, label: 'Đánh giá sản phẩm' },
    { icon: <Heart className="w-5 h-5" />, label: 'Sản phẩm yêu thích' },
    { icon: <Share2 className="w-5 h-5" />, label: 'Chia sẻ có lời' },
    { icon: <Shield className="w-5 h-5" />, label: 'Hợp đồng bảo hiểm' },
    { icon: <Clock className="w-5 h-5" />, label: 'Mua trước trả sau' },
    { icon: <Tag className="w-5 h-5" />, label: 'Mã giảm giá' },
    { icon: <Gift className="w-5 h-5" />, label: 'Astra của bạn' },
    { icon: <HelpCircle className="w-5 h-5" />, label: 'Hỗ trợ khách hàng' }
  ];

  const orders = [
    {
      id: 1,
      title: 'Set 3 Âu Inox Trộn Bột, Làm Bánh Tiện Ích Zwilling',
      price: '75.000 đ',
      seller: 'Smarthome29',
      status: 'cancelled',
      image: '/api/placeholder/80/80'
    },
    {
      id: 2,
      title: 'Yêu Những Ngày Nắng Chẳng Ghét Những Ngày Mưa',
      price: '90.100 đ',
      seller: 'Tiki Trading',
      status: 'cancelled',
      image: '/api/placeholder/80/80'
    },
    {
      id: 3,
      title: 'Blue Period - Tập 03',
      price: '41.000 đ',
      seller: 'Tiki Trading',
      status: 'cancelled',
      image: '/api/placeholder/80/80'
    }
  ];

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-sm">
        <div className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <img src="/api/placeholder/40/40" alt="Profile" className="rounded-full" />
            <div>
              <h3 className="font-medium">Brian Dang</h3>
              <p className="text-sm text-gray-500">Thông tin tài khoản</p>
            </div>
          </div>
        </div>
        <nav className="p-2">
          {sidebarItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center space-x-3 p-2 hover:bg-blue-50 rounded-lg cursor-pointer transition-colors"
            >
              {item.icon}
              <span className="text-sm">{item.label}</span>
            </div>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl font-medium mb-6">Đơn hàng của tôi</h1>
        
        {/* Tabs */}
        <div className="flex space-x-6 border-b mb-6">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`pb-4 px-2 ${
                activeTab === tab.id
                  ? 'border-b-2 border-blue-500 text-blue-500'
                  : 'text-gray-500'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="flex items-center border rounded-lg overflow-hidden bg-white">
            <input
              type="text"
              placeholder="Tìm đơn hàng theo Mã đơn hàng, Nhà bán hoặc Tên sản phẩm"
              className="flex-1 px-4 py-2 outline-none"
            />
            <button className="px-6 py-2 bg-blue-500 text-white hover:bg-blue-600 transition-colors">
              Tìm đơn hàng
            </button>
          </div>
        </div>

        {/* Orders List */}
        <div className="space-y-4">
          {orders.map(order => (
            <div
              key={order.id}
              className="bg-white p-4 rounded-lg shadow-sm hover:shadow-md transition-shadow"
              onMouseEnter={() => setHoveredOrder(order.id)}
              onMouseLeave={() => setHoveredOrder(null)}
            >
              <div className="flex items-start space-x-4">
                <img src={order.image} alt={order.title} className="w-20 h-20 object-cover rounded" />
                <div className="flex-1">
                  <h3 className="font-medium">{order.title}</h3>
                  <p className="text-sm text-gray-500">Shop: {order.seller}</p>
                  <div className="mt-2 flex items-center space-x-2">
                    <span className="px-2 py-1 bg-blue-100 text-blue-600 text-sm rounded">
                      30 NGÀY ĐỔI TRẢ
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium">{order.price}</p>
                  {hoveredOrder === order.id && (
                    <div className="mt-2 space-x-2">
                      <button className="px-4 py-2 border border-blue-500 text-blue-500 rounded hover:bg-blue-50">
                        Mua lại
                      </button>
                      <button className="px-4 py-2 text-gray-600 hover:text-gray-800">
                        Xem chi tiết
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderManagement;