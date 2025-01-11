import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchStoreDetails } from '../../service/storeApi';
import { Input, Spin, Pagination } from 'antd';
import ProductCard from '../../components/user/ProductCard';

const { Search } = Input;

const StoreDetail = () => {
  const { storeId } = useParams();
  const [store, setStore] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [query, setQuery] = useState('');
  const [sort, setSort] = useState('popular'); // Default sorting
  const [activeTab, setActiveTab] = useState('products'); // Default tab
  const itemsPerPage = 24; // Number of products per page

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const data = await fetchStoreDetails(storeId, currentPage, itemsPerPage, query, sort);
        setStore(data.store);
        setProducts(data.products);
        setTotalPages(data.total_pages || 1);
      } catch (err) {
        console.error('Error fetching store details:', err);
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [storeId, currentPage, query, sort]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearch = (value) => {
    setQuery(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSortChange = (sortType) => {
    setSort(sortType);
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  if (loading) return <Spin />;
  if (error) return <div>Error loading store details.</div>;

  return (
    <div className="max-w-6xl mx-auto mt-5">
      {/* Store Header */}
      <div className="bg-blue-600 text-white p-6 rounded-md shadow-md">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={store.icon}
              alt={store.name}
              className="w-16 h-16 rounded-full object-cover"
            />
            <div>
              <h1 className="text-2xl font-bold">{store.name}</h1>
              <p className="text-yellow-300 font-semibold">
                ★ {parseFloat(store.avg_rating_point).toFixed(1)} / 5 • {(store.total_follower / 1000).toFixed(1)}k+ Người theo dõi
              </p>
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <div className="flex gap-6 text-sm">
            <span
              className={`cursor-pointer pb-1 ${activeTab === 'products' ? 'border-b-2 border-white' : ''
                }`}
              onClick={() => handleTabChange('products')}
            >
              Cửa Hàng
            </span>
            <span
              className={`cursor-pointer pb-1 ${activeTab === 'profile' ? 'border-b-2 border-white' : ''
                }`}
              onClick={() => handleTabChange('profile')}
            >
              Hồ Sơ Cửa Hàng
            </span>
          </div>
          {activeTab === 'products' && (
            <Search
              placeholder="Tìm sản phẩm tại cửa hàng"
              allowClear
              onSearch={handleSearch}
              style={{ width: 300 }}
            />
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="bg-white p-6 rounded-md shadow-md mt-6">
        {activeTab === 'products' ? (
          <div>
            {/* Sorting */}
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Sản Phẩm</h2>
              <div className="flex gap-4">
                <button
                  className={`px-4 py-2 rounded-md ${sort === 'popular' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  onClick={() => handleSortChange('popular')}
                >
                  Phổ biến
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${sort === 'best_selling' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  onClick={() => handleSortChange('best_selling')}
                >
                  Bán chạy
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${sort === 'price_asc' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  onClick={() => handleSortChange('price_asc')}
                >
                  Giá thấp đến cao
                </button>
                <button
                  className={`px-4 py-2 rounded-md ${sort === 'price_desc' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'
                    }`}
                  onClick={() => handleSortChange('price_desc')}
                >
                  Giá cao đến thấp
                </button>
              </div>
            </div>

            {/* Product List */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  image={product.thumbnail_url}
                  name={product.name}
                  price={product.price}
                  originalPrice={product.original_price}
                  discountRate={product.discount_rate}
                  quantitySold={product.quantity_sold}
                  ratingAverage={product.rating_average}
                />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center mt-4">
              <Pagination
                current={currentPage}
                total={totalPages * itemsPerPage}
                pageSize={itemsPerPage}
                onChange={handlePageChange}
                showSizeChanger={false}
              />
            </div>
          </div>
        ) : (
          <div>
            <h2 className="text-xl font-semibold mb-4">Thông Tin Cửa Hàng</h2>
            <div className="grid grid-cols-1 gap-4">
              {store.info.map((info, index) => (
                <div key={index} className="flex items-center gap-4">
                  {info.type === 'review' && (
                    <>
                      <strong>Đánh giá:</strong>
                      <span>
                        {info.title} {info.sub_title}
                      </span>
                    </>
                  )}
                  {info.type === 'normal' && (
                    <>
                      <strong>Người theo dõi:</strong>
                      <span>
                        {info.title} {info.sub_title}
                      </span>
                    </>
                  )}
                  {info.type === 'chat' && (
                    <>
                      <strong>Phản hồi Chat:</strong>
                      <span>
                        {info.title} {info.sub_title}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoreDetail;
