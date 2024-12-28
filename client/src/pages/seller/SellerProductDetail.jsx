import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getProductById } from '../../service/seller/productApi';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css'; // Import default Swiper styles
import { FaChevronLeft, FaChevronRight, FaArrowLeft } from 'react-icons/fa'; // Import mũi tên từ react-icons

const SellerProductDetail = () => {
  const { productId } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDescriptionExpanded, setIsDescriptionExpanded] = useState(false);  // State to toggle description
  const swiperRef = useRef(null);  // Reference to Swiper instance
  const navigate = useNavigate();  // Hook for navigating programmatically

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const result = await getProductById(productId);
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
    <div className="container mx-auto p-6 space-y-6">
      <div className="relative">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}  // Go back to the previous page
          className="absolute top-1 left-1 text-white bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700"
        >
          <FaArrowLeft size={20} />
        </button>

        <h1 className="text-3xl font-bold text-center">{product.name}</h1>
      </div>

      <div className="max-w-3xl mx-auto relative">
        {/* Swiper for image carousel */}
        <Swiper
          spaceBetween={10} // Space between slides
          slidesPerView={1} // Show one slide at a time
          loop={true} // Loop the carousel
          ref={swiperRef}  // Set the ref to access Swiper instance
        >
          {product.thumbnails.map((thumb, index) => (
            <SwiperSlide key={index}>
              <img className="w-full h-auto max-w-xs mx-auto rounded-lg shadow-lg mb-2" src={thumb} alt={`product-thumbnail-${index}`} />
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
            {product.specifications.map((spec, index) => (
              <div key={index} className="bg-gray-100 p-4 rounded-lg shadow-sm">
                <p className="text-lg font-medium text-gray-700">{spec.name}</p>
                <ul className="list-disc pl-5 space-y-2 mt-2">
                  {spec.attributes.map((attribute, idx) => (
                    <li key={idx} className="text-gray-600">
                      <strong>{attribute.name}:</strong> {attribute.value}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Description section */}
      <div className="mt-6">
        <p className="text-lg font-semibold text-gray-700">
          <strong>Description:</strong>
        </p>
        {/* Render description with HTML */}
        <div
          className="text-gray-600"
          dangerouslySetInnerHTML={{
            __html: isDescriptionExpanded
              ? product.description
              : product.description.split('</p>')[0] + '</p>', // Truncate description for "See More"
          }}
        />
        <button
          onClick={() => setIsDescriptionExpanded(!isDescriptionExpanded)}
          className="text-blue-500 mt-2"
        > 
          {isDescriptionExpanded ? 'See Less' : 'See More'}
        </button>
      </div>
    </div>
  );
};

export default SellerProductDetail;
