import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from './ProductCard'; // Assuming this component exists

const ProductSlider = ({ title, products, url, isTopDeal, isFlashSale, clickable = true }) => {
    const navigate = useNavigate();

    if (!products || products.length === 0) {
        return null;
    }

    const handleProductClick = (product) => {
        navigate(`/product/${product.url_key}`, { state: { product } });
    };

    // Chunk the products into groups of 6
    const chunkedProducts = [];
    for (let i = 0; i < products.length; i += 5) {
        chunkedProducts.push(products.slice(i, i + 5));
    }

    // If no products exist after chunking, don't render the slider
    if (chunkedProducts.length === 0) {
        return null;
    }

    return (
        <div className="mt-10 max-w-4xl mx-auto p-4 bg-blue-500 rounded-md overflow-hidden">
            <div className="flex justify-between mb-2">
                <h2 className="text-2xl font-semibold text-white">{title}</h2>
                {clickable ? (
                    <Link
                        to={url}
                        className="text-sm text-gray-200 hover:text-white hover:underline transition-colors duration-200"
                    >
                        Xem tất cả
                    </Link>
                ) : (
                    <span className="text-sm text-gray-400 cursor-not-allowed">

                    </span>
                )}
            </div>

            <Swiper
                modules={[Navigation]}
                navigation
                spaceBetween={20}
                slidesPerView={1} // Only 1 slide visible at a time
            >
                {chunkedProducts.map((productGroup, index) => (
                    <SwiperSlide key={index}>
                        <div className="flex flex-wrap justify-center gap-4">
                            {productGroup.map((product) => (
                                <div
                                    key={product.id}
                                    onClick={() => handleProductClick(product)}
                                    className="flex justify-center flex-shrink-0 w-36 h-80 mr-2 bg-white cursor-pointer rounded-lg shadow-md"
                                >
                                    <ProductCard
                                        image={product.thumbnail_url || product.name}
                                        name={product.name}
                                        price={product.price}
                                        originalPrice={product.original_price}
                                        discountRate={product.discount_rate}
                                        quantitySold={product.quantity_sold}
                                        ratingAverage={product.rating_average}
                                        isTopDeal={isTopDeal}
                                        isFlashSale={isFlashSale}
                                    />
                                </div>
                            ))}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ProductSlider;