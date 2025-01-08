import { useEffect, useState } from "react";
import { fetchProductByCategory } from "../../service/productApi";
import ProductCard from "./ProductCard";
import { Spin, Pagination } from "antd";
import { useNavigate } from "react-router-dom";

const ProductList = ({ categoryId }) => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);  
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const itemsPerPage = 24;

    useEffect(() => {
        // Reset pagination when category changes
        setCurrentPage(1);
        setTotalPages(1);
    }, [categoryId]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                let id = parseInt(categoryId.replace('c', ''), 10);
                const result = await fetchProductByCategory({
                    category: id,
                    limit: itemsPerPage,
                    page: currentPage,
                });

                setProducts(result.data);
            //    setCurrentPage(result.paging.current_page);
                setTotalPages(result.paging.total_pages);
        
            } catch (err) {
                setError(err);
                console.error('Failed to fetch products', err);
            } finally {
                // Wait for 1 second to hide loading spinner
                setTimeout(() => {
                    setLoading(false);
                }, 0);
            }
        };

        if (categoryId) {
            fetchData();
        }

    }, [categoryId, currentPage]);

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const handleProductClick = (product) => {
        navigate(`/${product.url_key}`, { state: { product }  });

    };

    if (loading) { return <Spin />; }
    if (error) { return <div>Failed to fetch products</div>; }
    if (!products || products.length === 0)
    {
        return (
            <div className="text-3xl font-bold text-gray-700 bg-gray-300 w-full h-60 pt-20  text-center">
                No products found
            </div>
        );
    }

    return (
        <div className="bg-gray-300 max-w-5xl">
            <p className="text-2xl font-semibold mb-4">Sản phẩm</p>
            <div className="grid grid-cols-4 gap-4">
                {products.map((product) => (
                    <div 
                        key={product.id}
                        onClick={() => handleProductClick(product)}
                        className="cursor-pointer"
                    >
                        <ProductCard
                            key={product.id}
                            image={product.thumbnail_url || product.name}
                            name={product.name}
                            price={product.price}
                            originalPrice={product.original_price}
                            discountRate={product.discount_rate}
                            quantitySold={product.quantity_sold}
                            ratingAverage={product.rating_average}
                        />
                    </div>
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
    );
};

export default ProductList;