import { useLocation, useParams } from 'react-router-dom';
import {Radio, Pagination } from 'antd';
import { StarFilled } from '@ant-design/icons';

function ResultFound() {
  const { keyword } = useParams();
  const location = useLocation();


  // Tách phần đầu tiên của URL (có thể lấy ra "search")
  const pathSegments = location.pathname.split('/');
  const route = decodeURIComponent(pathSegments[1]); // mã hóa thành "search"

  const sortOptions = [
    { label: 'Mới Nhất', value: 'newest' },
    { label: 'Bán Chạy', value: 'bestseller' },
    { label: 'Giá', value: 'price' }
  ];

  return (
    <>
      {/* Right Content Area */}
      <div className="flex-1">
        {/* Search Keyword */}
        <div className="mb-4">
          <h2 className="text-lg font-semibold">
            {route === 'search' && (
              <>
                Kết quả tìm kiếm cho từ khóa: <span className='text-blue-500'>{keyword}</span>
              </>
            )}
          </h2>
        </div>

        {/* Sort Bar */}
        <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span>Sắp xếp theo</span>
            <Radio.Group buttonStyle="solid">
              {sortOptions.map(option => (
                <Radio.Button key={option.value} value={option.value}>
                  {option.label}
                </Radio.Button>
              ))}
            </Radio.Group>
          </div>
          <Pagination simple current={1} total={50} pageSize={10} />
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {/* Sample Product Card */}
          <div className="bg-white p-3 rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <img
              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSLVdQcFZK2kZQv4SvCi8u_IliTiHq0usLUjg&s"
              alt="Product"
              className="w-full aspect-square object-cover mb-3"
            />
            <h3 className="text-sm mb-2 line-clamp-2">
              Áo Khoác Bomber DL.or Vải Nhung 2Lớp In Họa...
            </h3>
            <div className="text-red-500">₫199.000</div>
            <div className="flex items-center gap-1 mt-2">
              <StarFilled className="text-yellow-400 text-xs" />
              <span className="text-xs">4.9</span>
              <span className="text-xs text-gray-500">Đã bán 3.8k</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ResultFound;