import { useState, useEffect } from 'react';
import { getAllCategories } from '../service/seller/categoryApi';

// Custom hook để quản lý việc tải và tìm kiếm danh mục
const useCategories = (searchTerm = '', page = 1, limit = 50) => {
  const [categories, setCategories] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Hàm tải danh mục
  const loadCategories = async (search = '', page = 1) => {
    setLoading(true);
    try {
      const { data, total: totalCount } = await getAllCategories({ search, page, limit });
      setCategories((prevCategories) => {
        if (page === 1) return data; // Nếu là trang đầu, reset lại dữ liệu
        return [...prevCategories, ...data]; // Gộp dữ liệu các trang tiếp theo
      });
      setTotal(totalCount);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Gọi loadCategories khi searchTerm hoặc page thay đổi
  useEffect(() => {
    loadCategories(searchTerm, page);
  }, [searchTerm, page]);

  return { categories, total, loading, error, loadCategories };
};

export default useCategories;
