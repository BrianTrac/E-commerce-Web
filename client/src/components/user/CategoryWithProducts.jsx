import { useParams } from "react-router-dom";
import Category from "./Category";
import ProductList from "./ProductList";

const CategoryWithProducts = () => {
    const { url_key, id } = useParams();
    
    return (
        <div className="flex flex-col items-center space-y-16 bg-red-700 rounded-md max-w-6xl mx-auto">
            <Category id={id} />
            <ProductList categoryId={id} />
        </div>
    );
};

export default CategoryWithProducts;