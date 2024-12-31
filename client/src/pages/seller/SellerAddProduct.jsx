import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import slugify from 'slugify'; // Dùng để chuyển tên thành slug
import { addProduct } from '../../service/seller/productApi';
import { uploadImages } from '../../helpers/upload'; // Import hàm upload ảnh
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import useCategories from '../../hooks/useCategories'; // Import custom hook
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

// Xác thực dữ liệu bằng Yup
const schema = yup.object().shape({
  name: yup.string().required('Tên sản phẩm là bắt buộc'),
  discount_rate: yup
    .number()
    .min(0, 'Tỷ lệ giảm giá không được âm')
    .max(100, 'Tỷ lệ giảm giá không được vượt quá 100'),
  original_price: yup
    .number()
    .required('Giá gốc là bắt buộc')
    .positive('Giá gốc phải lớn hơn 0'),
  short_description: yup.string().required('Miêu tả ngắn là bắt buộc'),
  description: yup.string().required('Miêu tả chi tiết là bắt buộc'),
  specifications: yup.string().required('Thông số là bắt buộc'),
  qty: yup
    .number()
    .required('Số lượng là bắt buộc')
    .positive('Số lượng phải lớn hơn 0')
    .integer('Số lượng phải là số nguyên'),
});

const SellerAddProduct = () => {
  const {
    control,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [imageUploads, setImageUploads] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  // Sử dụng custom hook để tải danh mục với tìm kiếm
  const { categories, loading, error, loadCategories } = useCategories(searchTerm, 1, 50); // Tải danh mục với tìm kiếm từ backend

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      setImageUploads(files);

      const fileReaders = files.map((file) => {
        return new Promise((resolve, reject) => {
          const fileReader = new FileReader();
          fileReader.onloadend = () => {
            resolve(fileReader.result); // Khi hoàn thành, lưu kết quả (dữ liệu URL)
          };
          fileReader.onerror = reject; // Nếu có lỗi, reject Promise
          fileReader.readAsDataURL(file); // Đọc file dưới dạng base64 URL
        });
      });

      // Khi tất cả các file đã được đọc, cập nhật previewImages
      Promise.all(fileReaders)
        .then((imagePreviews) => {
          setPreviewImages(imagePreviews); // Cập nhật mảng preview images
        })
        .catch((error) => {
          console.error('Error reading files:', error);
        });
    }
  };

  // Gửi dữ liệu lên backend khi form được submit
  const onSubmit = async (data) => {
    try {
      const imageUrls = await uploadImages(imageUploads);

      const formattedData = {
        ...data,
        category_id: selectedCategory ? selectedCategory.value : 0, // Lấy id từ danh mục đã chọn
        category_name: selectedCategory ? selectedCategory.label : '', // Lấy name từ danh mục đã chọn
        images: imageUrls,
        thumbnail_url: imageUrls[0]?.thumbnail_url || '',
        current_seller: { store_id: '40395' },
        price: data.original_price * (1 - data.discount_rate / 100),
        url_key: slugify(data.name, { lower: true, strict: true }) || '',
        rating_average: 0.0,
        inventory_status: 'pending',
      };

      const response = await addProduct(axiosPrivate, formattedData);
      alert(`${response.message}`);
      navigate('/seller/product-management');
    } catch (error) {
      console.error('Failed to add product:', error);
      alert('Có lỗi xảy ra khi thêm sản phẩm!');
    }
  };

  // Cập nhật giá trị tìm kiếm
  const handleSearchChange = (inputValue) => {
    setSearchTerm(inputValue);
    loadCategories(inputValue, 1); // Gọi lại API để tìm kiếm và lấy trang 1
  };

  return (
    <>
      <div className="relative">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)} // Go back to the previous page
          className="absolute top-1 left-1 text-white bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700"
        >
          <FaArrowLeft size={20} />
        </button>
      </div>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="relative">
          <h2 className="text-2xl text-center font-semibold mb-6">Thêm Sản Phẩm Mới</h2>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Tên sản phẩm */}
          <div>
            <label className="block font-medium mb-1">Tên sản phẩm</label>
            <input
              type="text"
              {...register('name')}
              className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          {/* Danh mục */}
          <div>
            <label className="block font-medium mb-1">Danh mục</label>
            <Select
              value={selectedCategory}
              onChange={setSelectedCategory}
              onInputChange={handleSearchChange} // Cập nhật từ khóa tìm kiếm khi người dùng gõ
              options={categories.map((category) => ({
                value: category.id,
                label: category.name,
              }))}
              placeholder="Chọn danh mục"
              isClearable
            />
            {errors.category && <p className="text-red-500 text-sm">{errors.category.message}</p>}
          </div>

          {/* Ảnh sản phẩm */}
          <div>
            <label className="block font-medium mb-1">Ảnh sản phẩm</label>
            <input
              type="file"
              onChange={handleImageChange}
              accept="image/*"
              multiple
              className={`w-full p-2 border rounded ${errors.images ? 'border-red-500' : 'border-gray-300'}`}
            />
            {previewImages.length > 0 && (
              <div className="mt-4 flex space-x-4">
                {previewImages.map((preview, index) => (
                  <img
                    key={index}
                    src={preview}
                    alt={`preview-${index}`}
                    className="w-32 h-32 object-cover rounded"
                  />
                ))}
              </div>
            )}
          </div>

          {/* Các trường khác */}
          {/* Tỷ lệ giảm giá */}
          <div>
            <label className="block font-medium mb-1">Tỷ lệ giảm giá (%)</label>
            <input
              type="number"
              {...register('discount_rate')}
              className={`w-full p-2 border rounded ${errors.discount_rate ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.discount_rate && (
              <p className="text-red-500 text-sm">{errors.discount_rate.message}</p>
            )}
          </div>

          {/* Giá gốc */}
          <div>
            <label className="block font-medium mb-1">Giá gốc</label>
            <input
              type="number"
              {...register('original_price')}
              className={`w-full p-2 border rounded ${errors.original_price ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.original_price && (
              <p className="text-red-500 text-sm">{errors.original_price.message}</p>
            )}
          </div>

          {/* Miêu tả ngắn */}
          <div>
            <label className="block font-medium mb-1">Miêu tả ngắn</label>
            <textarea
              {...register('short_description')}
              className={`w-full p-2 border rounded ${errors.short_description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.short_description && (
              <p className="text-red-500 text-sm">{errors.short_description.message}</p>
            )}
          </div>

          {/* Miêu tả chi tiết */}
          <div>
            <label className="block font-medium mb-1">Miêu tả chi tiết</label>
            <textarea
              {...register('description')}
              className={`w-full p-2 border rounded ${errors.description ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description.message}</p>
            )}
          </div>

          {/* Thông số */}
          <div>
            <label className="block font-medium mb-1">Thông số</label>
            <textarea
              {...register('specifications')}
              className={`w-full p-2 border rounded ${errors.specifications ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.specifications && (
              <p className="text-red-500 text-sm">{errors.specifications.message}</p>
            )}
          </div>

          {/* Số lượng */}
          <div>
            <label className="block font-medium mb-1">Số lượng</label>
            <input
              type="number"
              {...register('qty')}
              className={`w-full p-2 border rounded ${errors.qty ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.qty && <p className="text-red-500 text-sm">{errors.qty.message}</p>}
          </div>

          {/* Nút submit */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          >
            Thêm sản phẩm
          </button>
        </form>
      </div>
    </>
  );
};

export default SellerAddProduct;