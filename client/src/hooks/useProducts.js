import { useState, useEffect } from 'react';
import { getAllProducts } from '../service/seller/productApi';
import useAxiosPrivate from './useAxiosPrivate';

// Custom hook để quản lý việc tải và tìm kiếm sản phẩm
const useProducts = (searchTerm = '', page = 1, limit = 50) => {
  const [products, setProducts] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const axiosPrivate = useAxiosPrivate();


  const loadProducts = async (search = '', page = 1) => {
    setLoading(true);
    try {
      const { data, total: totalCount } = await getAllProducts({axiosPrivate, search, page, limit });
      setProducts((prevProducts) => {
        if (page === 1) return data; 
        return [...prevProducts, ...data]; 
      });
      setTotal(totalCount);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts(searchTerm, page);
  }, [searchTerm, page]);

  return { products, total, loading, error, loadProducts };
};

export default useProducts;
