import React from 'react';
import BestSellerItem from './BestSellerItem';
import { RightOutlined } from '@ant-design/icons';

const BestSeller = () => {
  const products = [
    {
      id: 1,
      image: "https://bizweb.dktcdn.net/thumb/1024x1024/100/428/200/products/47c23a108b4b5b15025a13.jpg?v=1688032680417",
      title: "Tủ Giấy Gỗ",
      price: "599000",
      isTop: true
    },
    // Thêm các sản phẩm khác tại đây
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      {/* Responsive header for section */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
        <h2 className="text-red-500 font-medium text-xl mb-2 sm:mb-0">SẢN PHẨM BÁN CHẠY</h2>
        <button className="flex items-center text-red-500 hover:opacity-80">
          <span className="text-sm font-bold text-white cursor-pointer hover:underline">
            Xem Tất Cả
          </span>
          <RightOutlined style={{ fontSize: '16px', marginLeft: '4px' }} />
        </button>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 relative">
        {products.map(product => (
          <BestSellerItem
            key={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
            isTop={product.isTop}
          />
        ))}
      </div>
    </div>
  );
};

export default BestSeller;