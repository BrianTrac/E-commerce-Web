import { Checkbox, Input} from 'antd';
import { StarFilled } from '@ant-design/icons';
import { useState } from 'react';

function Filter() {
  const categories = [
    'Áo Khoác Mùa Đông & Áo Choàng',
    'Thời Trang Nữ',
    'Áo Hoodie, Áo Len & Áo Nỉ',
    'Áo Khoác'
  ];

  const locations = [
    'Hà Nội',
    'TP Hồ Chí Minh',
    'Thái Nguyên',
    'Vĩnh Phúc'
  ];

  const [priceFrom, setPriceFrom] = useState('');
  const [priceTo, setPriceTo] = useState('');
  const [selectedRating, setSelectedRating] = useState(null);

  // Hàm định dạng VND
  const formatPrice = (value) => {
    return value.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  const handlePriceChange = (setter) => (e) => {
    const formattedValue = formatPrice(e.target.value.replace(/\./g, ''));
    setter(formattedValue);
  };
  return (
    <>
      {/* Left Sidebar Filters */}
      <div className="w-64 flex-shrink-0">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <h3 className="text-lg font-medium mb-4">BỘ LỌC TÌM KIẾM</h3>

          {/* Categories */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Theo Danh Mục</h4>
            <div className="space-y-2">
              {categories.map((category, index) => (
                <Checkbox key={index} className="flex items-center space-x-2">
                  {category}
                </Checkbox>
              ))}
              <button className="text-gray-500 text-sm mt-2">Thêm</button>
            </div>
          </div>

          {/* Locations */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Nơi Bán</h4>
            <div className="space-y-2">
              {locations.map((location, index) => (
                <Checkbox key={index} className="flex">
                  {location}
                </Checkbox>
              ))}
              <button className="text-gray-500 text-sm mt-2">Thêm</button>
            </div>
          </div>

          {/* Price Range */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Khoảng Giá</h4>
            <div className="flex gap-2">
              <Input
                placeholder="₫ TỪ"
                className="w-24"
                value={priceFrom}
                onChange={handlePriceChange(setPriceFrom)}
              />
              <Input
                placeholder="₫ ĐẾN"
                className="w-24"
                value={priceTo}
                onChange={handlePriceChange(setPriceTo)}
              />
            </div>
          </div>

          {/* Ratings */}
          <div className="mb-6">
            <h4 className="font-medium mb-2">Đánh Giá</h4>
            <div className="space-y-2">
              {[5, 4, 3, 2].map((rating) => (
                <div
                  key={rating}
                  className={`flex items-center gap-1 cursor-pointer ${selectedRating === rating ? 'text-blue-500' : 'text-gray-600'
                    }`}
                  onClick={() => setSelectedRating(rating)}
                >
                  {Array(rating)
                    .fill()
                    .map((_, i) => (
                      <StarFilled key={i} className="text-yellow-400 text-sm" />
                    ))}
                  <span className="text-sm">trở lên</span>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2">
            <button className="w-full py-2 bg-gray-200 rounded hover:bg-gray-300">
              XÓA TẤT CẢ
            </button>
            <button className="w-full py-2 bg-blue-200 rounded hover:bg-blue-300">
              ÁP DỤNG
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Filter;