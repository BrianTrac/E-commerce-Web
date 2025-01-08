import React, { useEffect, useState } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { Radio, Pagination, Spin } from 'antd';
import { StarFilled } from '@ant-design/icons';
import { getSearchResults } from "../../redux/services/user/searchService";
import ProductCard from './ProductCard';

function ProductSearchList() {
  const { keyword } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  // Local state for search results, loading, error, and pagination
  const [results, setResults] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [status, setStatus] = useState('idle'); // 'idle', 'loading', 'succeeded', 'failed'
  const [error, setError] = useState(null);
  const [sort, setSort] = useState('default');
  const [currentPage, setCurrentPage] = useState(1);
  const [limit] = useState(20); // Number of items per page

  // Sort options for the radio buttons
  const sortOptions = [
    { label: 'Liên quan', value: 'most_relevant' },
    { label: 'Phổ biến', value: 'default' },
    { label: 'Mới Nhất', value: 'newest' },
    { label: 'Bán Chạy', value: 'top_seller' },
    { label: 'Giá cao đến thấp', value: 'price,desc' },
    { label: 'Giá thấp đến cao', value: 'price,asc' },
  ];

  useEffect(() => {
    // Reset pagination when keyword changes
    setCurrentPage(1);
    setTotalPages(1);
}, [keyword]);

  // Fetch search results when the keyword, sort, or page changes
  useEffect(() => {
    const fetchResults = async () => {
      setStatus('loading');
      try {
        const response = await getSearchResults({
          keyword,
          limit,
          page: currentPage,
          sort,
        });

        // Assuming the response has the structure you mentioned
        const { data, paging } = response;

        setResults(data); // Set the fetched products
        setTotalPages(paging.total_pages); // Set total number of pages
        setStatus('succeeded');
      } catch (err) {
        setError(err?.response?.data?.message || 'An error occurred');
        setStatus('failed');
      }
    };

    if (keyword) {
      fetchResults();
    }
  }, [keyword, currentPage, sort, limit]);

  // Handle sort change
  const handleSortChange = (e) => {
    setSort(e.target.value); // Update the sort state
    setCurrentPage(1); // Reset to first page when sorting changes
  };

  // Handle pagination change
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleProductClick = (product) => {
        navigate(`/product/${product.url_key}`, { state: { product }  });

    };

  return (
    <div className="flex-1">
      {/* Search Keyword */}
      <div className="mb-4">
        <h2 className="text-lg font-semibold">
          Kết quả tìm kiếm cho từ khóa: <span className="text-blue-500">{keyword}</span>
        </h2>
      </div>

      {/* Sort Bar */}
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <span>Sắp xếp theo</span>
          <Radio.Group value={sort} onChange={handleSortChange} buttonStyle="solid">
            {sortOptions.map(option => (
              <Radio.Button key={option.value} value={option.value}>
                {option.label}
              </Radio.Button>
            ))}
          </Radio.Group>
        </div>
      </div>

      {/* Pagination */}
      {status === 'succeeded' && totalPages > 0 && (
        <div className="flex justify-end mt-4">
          <Pagination
            simple
            current={currentPage}
            total={totalPages * limit} // total count = total pages * items per page
            pageSize={limit}
            onChange={handlePageChange}
            showSizeChanger={false}
          />
        </div>
      )}

      {/* Display Loading Spinner */}
      {status === 'loading' && (
        <div className="flex justify-center mt-6">
          <Spin size="large" />
        </div>
      )}

      {/* Error Message */}
      {status === 'failed' && (
        <div className="bg-red-100 text-red-600 p-4 rounded-lg mb-4">
          {error}
        </div>
      )}

      {/* Product Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {status === 'succeeded' && results.length === 0 && (
          <div className="col-span-4 text-center text-gray-500">
            Không có sản phẩm nào.
          </div>
        )}

        {status === 'succeeded' && results.map((product) => (
          <div 
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="cursor-pointer"
          >
            <ProductCard 
              key={product.id}
              image={product.thumbnail_url}
              name={product.name}
              price={product.price}
              originalPrice={product.original_price}
              discountRate={product.discount_rate}
              quantitySold={product.quantity_sold}
              ratingAverage={product.rating_average}
              isTopDeal={false}
              isFlashSale={false}
            />
          </div>
        ))}
      </div>

      {/* Pagination */}
      {status === 'succeeded' && totalPages > 0 && (
        // <Pagination
        //   simple
        //   current={currentPage}
        //   total={totalPages * limit} // total count = total pages * items per page
        //   pageSize={limit}
        //   onChange={handlePageChange}
        // />
        <div className="flex justify-center mt-4">
            <Pagination
                current={currentPage}
                total={totalPages * limit}
                pageSize={limit}
                onChange={handlePageChange}
                showSizeChanger={false}
            />
        </div>
      )}
    </div>
  );
}

export default ProductSearchList;
