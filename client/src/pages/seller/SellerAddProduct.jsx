import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import axios from 'axios';
import { addProduct } from '../../service/seller/productApi';

// Xác thực dữ liệu bằng Yup
const schema = yup.object().shape({
  name: yup.string().required('Tên sản phẩm là bắt buộc'),
  url_key: yup.string().required('URL Key là bắt buộc'),
  original_price: yup.number().required('Giá gốc là bắt buộc').positive('Giá gốc phải lớn hơn 0'),
  price: yup
    .number()
    .required('Giá bán là bắt buộc')
    .positive('Giá bán phải lớn hơn 0')
    .max(yup.ref('original_price'), 'Giá bán không được lớn hơn giá gốc'),
  short_description: yup.string().required('Miêu tả ngắn là bắt buộc'),
  thumbnail_url: yup.string().url('URL hình ảnh không hợp lệ'),
});

const SellerAddProduct = () => {
  const {
    control,
    handleSubmit,
    register,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const [previewImages, setPreviewImages] = useState([]);

  // Hàm xử lý submit
  const onSubmit = async (data) => {
    try {
      const response = await addProduct(data);
      console.log(response);
    } catch (error) {
      console.error('Failed to add product:', error);
    }
  };

  // Xử lý upload và preview hình ảnh
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    setPreviewImages(files.map((file) => URL.createObjectURL(file)));
    setValue(
      'images',
      files.map((file) => URL.createObjectURL(file))
    );
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-semibold mb-6">Thêm Sản Phẩm Mới</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Tên sản phẩm */}
        <div>
          <label className="block font-medium mb-1">Tên sản phẩm</label>
          <input
            type="text"
            {...register('name')}
            className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
        </div>

        {/* URL Key */}
        <div>
          <label className="block font-medium mb-1">URL Key</label>
          <input
            type="text"
            {...register('url_key')}
            className={`w-full p-2 border rounded ${errors.url_key ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.url_key && <p className="text-red-500 text-sm">{errors.url_key.message}</p>}
        </div>
        
        {/* Category ID */}
        <div>
          <label className="block font-medium mb-1">ID danh mục</label>
          <input
            type="number"
            {...register('category_id')}
            className={`w-full p-2 border rounded ${errors.category_id ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.category_id && <p className="text-red-500 text-sm">{errors.category_id.message}</p>}
        </div>

        {/* Category Name */}
        <div>
          <label className="block font-medium mb-1">Tên danh mục</label>
          <input
            type="text"
            {...register('category_name')}
            className={`w-full p-2 border rounded ${errors.category_name ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.category_name && <p className="text-red-500 text-sm">{errors.category_name.message}</p>}
        </div>

        {/* Rating Average */}
        <div>
          <label className="block font-medium mb-1">Đánh giá trung bình</label>
          <input
            type="number"
            step="0.1"
            {...register('rating_average')}
            className={`w-full p-2 border rounded ${errors.rating_average ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.rating_average && (
            <p className="text-red-500 text-sm">{errors.rating_average.message}</p>
          )}
        </div>

        {/* Inventory Status */}
        <div>
          <label className="block font-medium mb-1">Tình trạng tồn kho</label>
          <select
            {...register('inventory_status')}
            className={`w-full p-2 border rounded ${errors.inventory_status ? 'border-red-500' : 'border-gray-300'
              }`}
          >
            <option value="available">Còn hàng</option>
            <option value="out_of_stock">Hết hàng</option>
          </select>
          {errors.inventory_status && (
            <p className="text-red-500 text-sm">{errors.inventory_status.message}</p>
          )}
        </div>

        {/* Current Seller */}
        <div>
          <label className="block font-medium mb-1">Người bán hiện tại</label>
          <textarea
            {...register('current_seller')}
            className={`w-full p-2 border rounded ${errors.current_seller ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.current_seller && (
            <p className="text-red-500 text-sm">{errors.current_seller.message}</p>
          )}
        </div>

        {/* Giá gốc */}
        <div>
          <label className="block font-medium mb-1">Giá gốc</label>
          <input
            type="number"
            {...register('original_price')}
            className={`w-full p-2 border rounded ${errors.original_price ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.original_price && (
            <p className="text-red-500 text-sm">{errors.original_price.message}</p>
          )}
        </div>

        {/* Giá bán */}
        <div>
          <label className="block font-medium mb-1">Giá bán</label>
          <input
            type="number"
            {...register('price')}
            className={`w-full p-2 border rounded ${errors.price ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.price && <p className="text-red-500 text-sm">{errors.price.message}</p>}
        </div>

        {/* Miêu tả ngắn */}
        <div>
          <label className="block font-medium mb-1">Miêu tả ngắn</label>
          <textarea
            {...register('short_description')}
            className={`w-full p-2 border rounded ${errors.short_description ? 'border-red-500' : 'border-gray-300'
              }`}
          />
          {errors.short_description && (
            <p className="text-red-500 text-sm">{errors.short_description.message}</p>
          )}
        </div>

        {/* Ảnh sản phẩm */}
        <div>
          <label className="block font-medium mb-1">Ảnh sản phẩm</label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border rounded"
          />
          <div className="flex space-x-4 mt-4">
            {previewImages.map((img, index) => (
              <img
                key={index}
                src={img}
                alt={`Preview ${index}`}
                className="w-20 h-20 object-cover rounded"
              />
            ))}
          </div>
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
  );
};

export default SellerAddProduct;
