import { useLocation } from "react-router-dom";
import RecommendItem from "./RecommendItem";
import { useEffect, useState } from "react";
import { fetchRelatedProducts } from "../../service/productApi";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import { useNavigate } from "react-router-dom";
// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Recommend = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const { product } = state || {};
    const [recommendations, setRecommendations] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            if (product && product.id) {
                try {
                    const res = await fetchRelatedProducts(product.id);
                    setRecommendations(res.data);
                } catch (error) {
                    console.error("Failed to fetch related products:", error);
                }
            }
        };
        fetchData();
    }, [product]);

    const handleProductClick = (product) => {
        navigate(`/product/${product.url_key}`, { state: { product } });
    };

    return (
        <div className="max-w-8xl mx-auto bg-white bg-opacity-80 rounded-md">
            <div className="mb-4">
                <h2 className="text-red-500 font-medium text-xl p-3">GỢI Ý HÔM NAY</h2>
            </div>

            <div className="px-3 pb-12"> {/* Added pb-12 for pagination spacing */}
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={12}
                    navigation
                    pagination={{
                        clickable: true,
                        el: '.swiper-pagination',
                        type: 'bullets',
                    }}
                    className="relative" // Added relative positioning
                    breakpoints={{
                        640: {
                            slidesPerView: 2,
                            spaceBetween: 12
                        },
                        768: {
                            slidesPerView: 3,
                            spaceBetween: 12
                        },
                        1024: {
                            slidesPerView: 4,
                            spaceBetween: 12
                        }
                    }}
                >
                    {recommendations.map(item => (
                        <SwiperSlide key={item.id} className="pb-8"> {/* Added padding-bottom to slides */}
                            <RecommendItem
                                image={item.thumbnail_url}
                                title={item.name}
                                rating={item.rating_average}
                                sold={item.quantity_sold}
                                onClick={() => handleProductClick(item)}
                            />
                        </SwiperSlide>
                    ))}
                    <div className="swiper-pagination !bottom-0" /> {/* Positioned pagination at bottom */}
                </Swiper>
            </div>
        </div>
    );
};

export default Recommend;