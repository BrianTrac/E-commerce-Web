import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar } from 'react-icons/fa';

const TopProducts = ({ products }) => {
  const navigate = useNavigate();
  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const handleProductClick = (productId) => {
    navigate(`/seller/product-management/detail/${productId}`);
  };

  return (
    <div className="mt-8">
      <h2 className="text-3xl font-semibold mb-6">Sản phẩm bán chạy</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
            onClick={() => handleProductClick(product.id)}
          >
            <div className="relative h-64">
              <img
                src={product.thumbnails[0]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">{product.name}</h3>
              <div className="flex items-center mb-2">
                <FaStar className="text-yellow-500 mr-1" />
                <span className="text-gray-700">{product.rating}</span>
                <span className="text-gray-500 ml-2">({product.quantity_sold} sold)</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-lg font-bold text-blue-600">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-gray-500">{product.category}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopProducts;