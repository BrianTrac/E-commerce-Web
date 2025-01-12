import { useEffect, useState } from "react";
import { Spin, Pagination } from "antd";
import { useNavigate } from "react-router-dom";
import ProductCard from "../../components/user/ProductCard";
import { getFlashSalev2 } from "../../service/productApi";
import { ArrowLeft } from "lucide-react";

const FlashSalePage = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [sortBy, setSortBy] = useState("discount");
    const navigate = useNavigate();
    const itemsPerPage = 12;

    const [products, setProducts] = useState([]);
    const [pagination, setPagination] = useState({
        total_items: 0,
        from: 0,
        to: 0
    });

    useEffect(() => {
        const fetchFlashSale = async () => {
            try {
                setLoading(true);
                const response = await getFlashSalev2({
                    page: currentPage,
                    limit: itemsPerPage
                });

                setProducts(response.data);
                setPagination(response.paging);
            } catch (error) {
                console.error('Error fetching flash sale products:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlashSale();
    }, [currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
        window.scrollTo(0, 0);
    };

    const handleProductClick = (product) => {
        navigate(`/product/${product.url_key}`, { state: { product } });
    };

    const handleSortChange = (event) => {
        setSortBy(event.target.value);
        const sorted = [...products];
        switch (event.target.value) {
            case 'discount':
                sorted.sort((a, b) => b.discount_rate - a.discount_rate);
                break;
            case 'price':
                sorted.sort((a, b) => a.price - b.price);
                break;
            case 'popular':
                sorted.sort((a, b) => b.quantity_sold - a.quantity_sold);
                break;
            case 'rating':
                sorted.sort((a, b) => b.rating_average - a.rating_average);
                break;
            default:
                break;
        }
        setProducts(sorted);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <Spin size="large" />
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center gap-4 mb-8">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
                >
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Flash Sale</h1>
                    <p className="text-gray-600 mt-2">Khuyến mãi cực khủng</p>
                </div>
            </div>

            <div className="flex items-center gap-4 mb-6 p-4 bg-white rounded-lg shadow-sm">
                <span className="text-gray-700 font-medium">Sort by:</span>
                <select
                    value={sortBy}
                    onChange={handleSortChange}
                    className="border rounded-md px-3 py-2 text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                    <option value="discount">Giảm nhiều nhất</option>
                    <option value="price">Giá thấp nhất</option>
                    <option value="popular">Phổ biến nhất</option>
                    <option value="rating">Đánh giá cao nhất</option>
                </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                    <div
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-300 cursor-pointer"
                    >
                        <ProductCard
                            image={product.thumbnail_url}
                            name={product.name}
                            price={product.price}
                            originalPrice={product.original_price}
                            discountRate={product.discount_rate}
                            quantitySold={product.quantity_sold}
                            ratingAverage={product.rating_average}
                            isTopDeal={true}
                        />
                    </div>
                ))}
            </div>

            <div className="flex justify-center mt-8">
                <Pagination
                    current={currentPage}
                    total={pagination.total_items}
                    pageSize={itemsPerPage}
                    onChange={handlePageChange}
                    showSizeChanger={false}
                />
            </div>
        </div>
    );
};

export default FlashSalePage;