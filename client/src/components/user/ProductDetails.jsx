import { useLocation } from "react-router-dom";
import { fetchProductById } from "../../service/productApi";
import { useEffect, useState } from "react";

const ProductDetails = () => {
    const { state } = useLocation();
    const { product } = state || {};
//    const { id } = state || {};
//    const [product, setProduct] = useState(null);

    // useEffect(() => {
    //     const fetchData = async () => {
    //         try {
    //             debugger;
    //             const result = await fetchProductById(parseInt(id, 10));
    //             setProduct(result);
    //         } catch (err) {
    //             console.error('Failed to fetch product details', err);
    //         }
    //     };

    //     if (id) {
    //         fetchData();
    //     }

    // }, [id]);

    // If no product was passed via state, handle fallback logic
    if (!product) {
        return <div>No product details available. Please navigate through the product list.</div>;
    }

    return (
        product && (
            <div className="flex gap-8 bg-slate-700 max-w-5xl p-20 min-h-[600px] mx-auto">
                <div className="w-full bg-red-500">
                    <img
                        src={product.images[0].medium_url}
                        alt={product.name}
                        className="object-cover w-full h-full group-hover:scale-125 transition-transform duration-300"
                    />
                </div>
                <div className="text-white space-y-4">
                    <p className="text-2xl font-bold">{product.name}</p>
                    <p className="text-xl text-yellow-400">${product.price}</p>
                    <p className="text-lg">{product.short_description}</p>
                </div>
            </div>
        )
    );
};

export default ProductDetails;