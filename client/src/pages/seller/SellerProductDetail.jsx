import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../service/seller/productApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import default Swiper styles
import { FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa'; // Import mũi tên từ react-icons
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

const SellerProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);  // State to toggle description
  const [shouldShowToggle, setShouldShowToggle] = useState(false); // State to control See More visibility
  const descriptionRef = useRef(null); // Ref to measure the description height
  const swiperRef = useRef(null);  // Reference to Swiper instance
  const navigate = useNavigate();  // Hook for navigating programmatically
  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getProductById(axiosPrivate, productId);
        setProduct(result.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  useEffect(() => {
    if (product && descriptionRef.current) {
      const descriptionHeight = descriptionRef.current.scrollHeight;
      const lineHeight = parseFloat(
        window.getComputedStyle(descriptionRef.current).lineHeight
      );
      // Check if content exceeds 2 lines
      if (descriptionHeight / lineHeight > 3) {
        setShouldShowToggle(true);
      }
    }
  }, [product]);

  if (loading) {
    return <div className="text-center text-xl">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-500">Error: {error}</div>;
  }

  if (!product) {
    return <div className="text-center text-xl">No product data available</div>;
  }

  const rating = parseFloat(product.rating_average) || 0;

  return (
    <>
      <div className="relative">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}  // Go back to the previous page
          className="absolute top-1 left-1 text-white bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700"
        >
          <FaArrowLeft size={20} />
        </button>

      </div>
      <div className="container mx-auto p-6 space-y-6">
        <h1 className="text-3xl font-bold text-center">{product.name}</h1>

        <div className="max-w-3xl mx-auto relative">
          {product.thumbnails.length > 1 ? (
            // Hiển thị Swiper nếu có hơn 1 ảnh
            <>
              <Swiper
                spaceBetween={10} // Space between slides
                slidesPerView={1} // Show one slide at a time
                loop={true} // Loop the carousel
                ref={swiperRef} // Set the ref to access Swiper instance
              >
                {product.thumbnails.map((thumb, index) => (
                  <SwiperSlide key={index}>
                    <img
                      className="w-full h-auto max-w-xs mx-auto rounded-lg shadow-lg mb-2"
                      src={thumb}
                      alt={`product-thumbnail-${index}`}
                    />
                  </SwiperSlide>
                ))}
              </Swiper>

              {/* Custom Navigation Arrows */}
              <div className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white cursor-pointer z-10">
                <FaChevronLeft
                  size={30}
                  onClick={() => swiperRef.current.swiper.slidePrev()}
                  className="hover:bg-gray-700 p-3 rounded-full bg-gray-800"
                />
              </div>
              <div className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white cursor-pointer z-10">
                <FaChevronRight
                  size={30}
                  onClick={() => swiperRef.current.swiper.slideNext()}
                  className="hover:bg-gray-700 p-3 rounded-full bg-gray-800"
                />
              </div>
            </>
          ) : (
            // Hiển thị ảnh duy nhất nếu chỉ có 1 phần tử
            <img
              className="w-full h-auto max-w-xs mx-auto rounded-lg shadow-lg mb-2"
              src={product.thumbnails[0]}
              alt="product-thumbnail"
            />
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <p className="text-lg font-semibold text-gray-700">
              <strong>Discount Rate:</strong> <span className="text-red-500">{product.discount_rate}%</span>
            </p>
            <p className="text-lg font-semibold text-gray-700 line-through">
              <strong>Original Price:</strong> {Number(product.original_price).toLocaleString()} VND
            </p>
            <p className="text-lg font-semibold text-gray-700">
              <strong>Price:</strong> <span className="text-green-500">{Number(product.price).toLocaleString()} VND</span>
            </p>
            <p className="text-lg font-semibold text-gray-700">
              <strong>Quantity Sold:</strong> {product.quantity_sold}
            </p>
            <p className="text-lg font-semibold text-gray-700 mt-4">
              <strong>Rating Average:</strong> {rating.toFixed(1)} ⭐
            </p>
          </div>

          <div>
            <p className="text-xl font-semibold text-gray-700 mb-4">Specifications:</p>
            <div className="space-y-4">
              {Array.isArray(product.specifications) ? (
                // Nếu specifications là mảng
                product.specifications.map((spec, index) => (
                  <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                    <p className="text-lg font-medium text-gray-700">{spec.name}</p>
                    <ul className="list-disc pl-5 space-y-2 mt-2">
                      {spec.attributes.map((attribute, idx) => (
                        <li key={idx} className="text-gray-600">
                          <strong>{attribute.name}:</strong>{" "}
                          {/* Render HTML từ giá trị */}
                          <span
                            dangerouslySetInnerHTML={{ __html: attribute.value }}
                          ></span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))
              ) : (
                // Nếu specifications là chuỗi
                <p
                  className="text-lg font-medium text-gray-600"
                  dangerouslySetInnerHTML={{ __html: product.specifications }}
                ></p>
              )}
            </div>
          </div>
        </div>

        {/* Description section */}
        <div className="mt-6">
          <p className="text-lg font-semibold text-gray-700">
            <strong>Description:</strong>
          </p>
          <div
            ref={descriptionRef}
            className={`text-gray-600 overflow-hidden transition-all duration-300 ${isDescriptionExpanded ? 'max-h-full' : 'max-h-12'
              }`}
            dangerouslySetInnerHTML={{ __html: product.description }}
          />
          {shouldShowToggle && (
            <button
              onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
              className="text-blue-500 mt-2"
            >
              {isDescriptionExpanded ? 'See Less' : 'See More'}
            </button>
          )}
        </div>
      </div>
    </>
  );
};

export default SellerProductDetail;
