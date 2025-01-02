import { useLocation } from "react-router-dom";
import { fetchProductReviews } from "../../service/productApi";
import { useEffect, useState } from "react";
import { FaStar } from "react-icons/fa";
import Review from "./ProductReview";
import Recommend from "./Recommend";
import ProductCarousel from './ProductCarousel';

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductDetails = () => {
    const { state } = useLocation();
    const { product } = state || {};
    const [reviews, setReviews] = useState({
        rating_average: 0,
        reviews_count: 0,
        stars: {},
        data: [],
    });

    if (!product) {
        return <div>No product details available. Please navigate through the product list.</div>;
    }

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const data = await fetchProductReviews(product.id);
                setReviews(data);
            } catch (error) {
                console.error("Failed to fetch product reviews", error);
            }
        };

        if (product && product.id) {
            fetchReviews();
        }
    }, [product]);
    console.log(product);
    return (
        product && (
            <div>
                <div className="flex my-3 gap-8 bg-white bg-opacity-80 max-w-5xl p-10 min-h-[600px] mx-auto rounded-md">
                    <div className="flex-1 w-full bg-red-500 rounded-md">
                        <ProductCarousel images={product.images} />
                    </div>
                    <div className="flex-1 space-y-4 flex flex-col justify-between">
                        <p className="text-2xl font-bold">{product.name}</p>
                        <p className="text-xl text-red-500 font-bold">{formatPrice(product.price)}</p>
                        <p className="text-lg">{product.short_description}</p>
                        <div className="flex flex-col mt-auto gap-4">
                            <div className="flex gap-3">
                                <button className="bg-transparent border-2 border-blue-500 text-blue-500 w-1/2 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white">
                                    Thêm vào giỏ hàng
                                </button>
                                <button className="bg-transparent border-2 border-blue-500 text-blue-500 w-1/2 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white">
                                    Chat ngay
                                </button>
                            </div>
                            <div>
                                <button className="bg-orange-400 text-white w-full px-4 py-2 rounded-md hover:bg-orange-600">
                                    Mua ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="flex gap-8 bg-white bg-opacity-80 max-w-5xl p-5 min-h-[400px] mb-3 mx-auto items-start rounded-md">
                    {/* Description Section */}
                    <div className="flex-1 basis-2/3 pl-10 gap-3 text-lg">
                        <p className="text-2xl font-bold mb-4">{product.name}</p>
                        <div
                            className={`overflow-hidden`}
                            dangerouslySetInnerHTML={{ __html: product.description }}
                        />
                    </div>
                    <div className="flex-1 basis-1/3 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">Đánh giá sản phẩm</h2>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-3xl font-bold text-yellow-500">{reviews.rating_average}</span>
                            <div className="flex text-yellow-500">
                                {[...Array(5)].map((_, i) => (
                                    <FaStar key={i} className="text-sm" />
                                ))}
                            </div>
                            <span className="text-gray-600">{reviews.reviews_count} đánh giá</span>
                        </div>

                        {/* Ratings Breakdown */}
                        <div className="mb-6">
                            {Object.keys(reviews.stars).map((star) => {
                                const starCount = reviews.stars[star].count;
                                const starPercent = reviews.stars[star].percent;
                                return (
                                    <div key={star} className="flex items-center gap-2 mb-2">
                                        <span>{star} sao</span>
                                        <FaStar className="text-yellow-500" />
                                        <div className="w-40 bg-gray-200 h-2 rounded overflow-hidden">
                                            <div
                                                className="h-full bg-yellow-500"
                                                style={{ width: `${starPercent}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600">{starPercent}%</span>
                                        <span className="text-sm text-gray-600 ml-2">({starCount} đánh giá)</span>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Reviews Section */}
                        <div className="divide-y overflow-y-auto max-h-[600px]">
                            {reviews.data.map((review, index) => (
                                <Review key={index} review={review} /> // Use the Review component here
                            ))}
                        </div>
                    </div>
                </div>
                {/* Recommend Section */}
                <div className="max-w-5xl mx-auto">
                    <Recommend />
                </div>
            </div>
        )
    );
};

export default ProductDetails;
