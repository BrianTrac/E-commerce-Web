import { useLocation } from "react-router-dom";
import RecommendItem from "./RecommendItem";
import { useEffect, useState } from "react";
import { fetchRelatedProducts } from "../../service/productApi";
const Recommend = () => {
    const recommendations = [
        {
            id: 1,
            image: "https://cbu01.alicdn.com/img/ibank/O1CN01RHqmvH1b2SGMc5rAM_!!4216593407-0-cib.jpg",
            title: "Áo Khoác Bomber Unisex Vải Nhung 2 Lớp In Họa Tiết Tùm Lum",
            rating: 4.8,
            sold: "3.8k"
        },
        // Thêm sản phẩm khác tại đây
    ];

    const { state } = useLocation();
    const { product } = state || {};

    const [relatedProducts, setRelatedProducts] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            if (product && product.id) {
                try {
                    const res = await fetchRelatedProducts(product.id);
                    console.log(res);
                    // setRelatedProducts(res); // Assuming `res` contains the related products.
                } catch (error) {
                    console.error("Failed to fetch related products:", error);
                }
            }
        };

        fetchData();
    }, [product]);


    return (
        <div className="max-w-8xl mx-auto bg-white bg-opacity-80 rounded-md">
            <div className="mb-4">
                <h2 className="text-red-500 font-medium text-xl p-3">GỢI Ý HÔM NAY</h2>
            </div>

            <div className="grid grid-cols-2 p-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {recommendations.map(item => (
                    <RecommendItem
                        key={item.id}
                        image={item.image}
                        title={item.title}
                        rating={item.rating}
                        sold={item.sold}
                    />
                ))}
            </div>
        </div>
    );
};

export default Recommend;