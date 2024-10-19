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
  ];

  return (
    <div className="max-w-7xl mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-red-500 font-medium text-xl">SẢN PHẨM BÁN CHẠY</h2>
        <button className="flex items-center text-red-500 hover:opacity-80">
          <span className="text-sm">Xem Tất Cả</span>
          <RightOutlined  style={{fontSize: '16px'}}/>
        </button>
      </div>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 relative">
        {products.map(product => (
          <BestSellerItem
            key={product.id}
            image={product.image}
            title={product.title}
            price={product.price}
            isTop={product.isTop}
          />
        ))}
        
        {/* Navigation arrows */}
        {/* <button className="absolute -left-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100">
        <RightOutlined className='rotate-180' style={{fontSize: '16px'}}/>
        </button>
        <button className="absolute -right-4 top-1/2 -translate-y-1/2 bg-white shadow-md rounded-full p-2 hover:bg-gray-100">
        <RightOutlined  style={{fontSize: '20px'}}/>
        </button> */}
      </div>
    </div>
  );
};

export default BestSeller;