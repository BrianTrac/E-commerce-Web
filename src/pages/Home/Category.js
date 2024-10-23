import { useEffect, useState } from 'react';
import CategoryItem from './CategoryItem';
import { getListCategory } from '../../services/productCategory';

const Category = () => {
  const [productCategory, setproductCategory] = useState([]);
  
  useEffect(() => {
    const fetchApi = async () => {
      const response = await getListCategory();
      if (response) {
        setproductCategory(response);
      }
    };
    fetchApi();
  }, []);



  return (
    <div className="max-w-7xl mx-auto p-4">
      <h2 className="text-red-500 font-medium mb-4 text-xl">DANH MỤC</h2>

      {/* Responsive grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
        {productCategory.map(category => (
          <CategoryItem
            key={category._id}
            thumbnail={category.thumbnail}
            name={category.name}
          />
        ))}
      </div>
    </div>
  );
};

export default Category;
