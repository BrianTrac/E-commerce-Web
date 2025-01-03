import { useLocation } from "react-router-dom";
import { fetchProductById } from "../../service/productApi";
import { useEffect, useState } from "react";
import { FaStar, FaStarHalfAlt } from "react-icons/fa";
import { AiOutlineLike } from "react-icons/ai";
import Recommend from "./Recommend";
import QuantityControl from "./QuantityControl";
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { addToCardItem } from '../../redux/services/user/cartService';
import { setCartQuantity } from "../../redux/reducers/user/cartReducer";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

const ProductDetails = () => {
    const { state } = useLocation();
    const { product } = state || {};
    const [isExpanded, setIsExpanded] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const axiosPrivate = useAxiosPrivate();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    if (!product) {
        return <div>No product details available. Please navigate through the product list.</div>;
    }

    const toggleExpand = () => setIsExpanded(!isExpanded);

    const addToCart = async (id, quantity) => {
        const response = await addToCardItem(axiosPrivate, { itemId: id, quantity, selected: true });
        
        if (response.success) {
            dispatch(setCartQuantity(response.length));
            alert('Added to cart successfully');
        }
    }
 
    const handleQuantityChange = (value) => {
        setQuantity(value);
    };

    const handleCheckout = () => {
        const cartItems = [{ product_id: product.id, quantity, product }];
        navigate('/checkout/payment', {
            state: { cartItems }
        });
    };

    return (
        product && (
            <div>
                <div className="flex my-3 gap-8 bg-white bg-opacity-80 max-w-5xl p-10 min-h-[600px] mx-auto rounded-md">
                    <div className="flex-1 w-full bg-red-500 rounded-md">
                        <img
                            src={product.images[0].medium_url}
                            alt={product.name}
                            className="rounded-md object-cover w-full h-full group-hover:scale-125 transition-transform duration-300"
                        />
                    </div>
                    <div className="flex-1  space-y-4 flex flex-col justify-between">
                        <p className="text-2xl font-bold">{product.name}</p>
                        <p className="text-xl text-red-500 font-bold">{formatPrice(product.price)}</p>
                        <p className="text-lg">{product.short_description}</p>
                        <div className="flex items-center gap-2">
                            <p>Số Lượng</p>
                            <QuantityControl maxNumber={product.qty} onChange={handleQuantityChange} />
                            <p>Còn {product.qty} sản phẩm</p>
                        </div>
                        <div class="flex flex-col mt-auto gap-4">
                            <div className="flex gap-3">
                                <button
                                    className="bg-transparent border-2 border-blue-500 text-blue-500 w-1/2 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white"
                                    onClick={() => addToCart(product.id, quantity)}
                                >
                                    Thêm vào giỏ hàng
                                </button>
                                <button className="bg-transparent border-2 border-blue-500 text-blue-500 w-1/2 px-4 py-2 rounded-md hover:bg-blue-600 hover:text-white">
                                    Chat ngay
                                </button>
                            </div>
                            <div>
                                <button
                                    className="bg-orange-400 text-white w-full px-4 py-2 rounded-md hover:bg-orange-600"
                                    onClick={handleCheckout}
                                >
                                    Mua ngay
                                </button>
                            </div>
                        </div>

                    </div>
                </div>
                <div className="flex gap-8 bg-white bg-opacity-80 max-w-5xl p-5 min-h-[600px] mb-3 mx-auto items-start rounded-md">
                    {/* Discription Section */}
                    <div className="flex-1 basis-2/3 pl-10 gap-3 text-lg">
                        <p className="text-2xl font-bold mb-4">{product.name}</p>
                        <div
                            className={`overflow-hidden ${isExpanded ? "" : "line-clamp-6"}`}
                            dangerouslySetInnerHTML={{ __html: product.description }} />
                        <div className="flex justify-center mt-3">
                            <button
                                className="bg-transparent border-2 w-full border-gray-300 text-gray-500 px-2 py-1 rounded-md hover:bg-gray-600 hover:text-white"
                                onClick={toggleExpand}
                            >
                                {isExpanded ? "Thu gọn" : "Xem thêm"}
                            </button>
                        </div>
                    </div>
                    {/* Review Section */}
                    <div className="flex-1 basis-1/3 max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-md">
                        <h2 className="text-xl font-semibold mb-4">{product.name}</h2>
                        <div className="flex items-center gap-2 mb-6">
                            <span className="text-3xl font-bold text-yellow-500">{product.rating_average}</span>
                            <div className="flex text-yellow-500">
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStar />
                                <FaStarHalfAlt />
                            </div>
                            <span className="text-gray-600">4 đánh giá</span>
                        </div>

                        {/* Ratings Breakdown */}
                        <div className="mb-6">
                            {[5, 4, 3, 2, 1].map((star, index) => (
                                <div key={index} className="flex items-center gap-2">
                                    <span>{star}</span>
                                    <FaStar className="text-yellow-500" />
                                    <div className="w-40 bg-gray-200 h-2 rounded overflow-hidden">
                                        <div
                                            className={`h-full ${star === 5 ? "bg-yellow-500 w-[75%]" : star === 4 ? "bg-yellow-500 w-[25%]" : "bg-gray-200"}`}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600">
                                        {star === 5 ? "75%" : star === 4 ? "25%" : "0%"}
                                    </span>
                                </div>
                            ))}
                        </div>

                        {/* Reviews Section */}
                        <div className="divide-y">
                            {[{
                                name: "Em Vinh",
                                verified: true,
                                content: "Mình dùng em máy này màu đen hơn 1 tháng khá ổn, chỉ có điều là cho mình hỏi nếu như mình đổi sang 15 pro max cũng 512GB thì chỉ mất thêm tiền hay sao ạ.",
                                helpful: 7
                            }, {
                                name: "Chị Thu",
                                verified: true,
                                content: "Máy đẹp. Pin khoẻ",
                                helpful: 3
                            }].map((review, index) => (
                                <div key={index} className="py-4">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium">{review.name}</span>
                                        {review.verified && <span className="text-green-600 text-sm">Đã mua tại TGDĐ</span>}
                                    </div>
                                    <div className="flex items-center gap-1 text-yellow-500 my-2">
                                        {[...Array(5)].map((_, i) => (
                                            <FaStar key={i} className="text-sm" />
                                        ))}
                                    </div>
                                    <p className="text-gray-700 text-sm mb-2">{review.content}</p>
                                    <div className="flex items-center gap-2 text-sm text-gray-600">
                                        <AiOutlineLike /> Hữu ích ({review.helpful})
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Button */}
                        <button className="w-full mt-6 py-2 bg-transparent border-2 border-gray-500 text-gray-500 rounded-lg hover:bg-gray-500 hover:text-white hover:border-gray-500">
                            Xem thêm đánh giá
                        </button>
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