import React, { useState, useEffect } from 'react';
import { useForm, Controller, set } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import slugify from 'slugify'; // Dùng để chuyển tên thành slug
import { getProductById, updateProduct } from '../../service/seller/productApi'; // Import API
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import useCategories from '../../hooks/useCategories'; // Import useCategories hook
import { uploadImages } from '../../helpers/upload'; // Import uploadImages helper
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
});

const SellerEditProduct = () => {
  const { productId } = useParams(); // Lấy productId từ URL
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
  const [imageUploads, setImageUploads] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const navigate = useNavigate();

  const axiosPrivate = useAxiosPrivate();

  // Sử dụng hook để lấy danh mục
  const { categories, loading, error, loadCategories } = useCategories(searchTerm, 1, 50);

  // Load product details and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await getProductById(axiosPrivate, productId);
        const product = productResponse.data;

        // Load product details
        setValue('name', product.name);
        setValue('discount_rate', product.discount_rate);
        setValue('original_price', parseFloat(product.original_price));
        setValue('short_description', product.short_description);
        setValue('description', product.description);
        setValue('specifications', JSON.stringify(product.specifications));
        setValue('qty', product.quantity_sold);

        // Set preview images
        if (product.thumbnails) {
          setPreviewImages(product.thumbnails);
        }

        // Set category
        setSelectedCategory({ value: product.category_id, label: product.category_name });
        setValue('category', { value: product.category_id, label: product.category_name });
      } catch (error) {
        console.error('Error loading product or categories:', error);
        alert('Không thể tải dữ liệu sản phẩm hoặc danh mục!');
      }
    };

    fetchData();
  }, [productId, categories, setValue]);

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageUploads(files);

    const fileReaders = files.map((file) => {
      return new Promise((resolve, reject) => {
        const fileReader = new FileReader();
        fileReader.onloadend = () => resolve(fileReader.result);
        fileReader.onerror = reject;
        fileReader.readAsDataURL(file);
      });
    });

    Promise.all(fileReaders)
      .then((imagePreviews) => {
        setPreviewImages(imagePreviews);
      })
      .catch((error) => console.error('Error reading files:', error));
  };

  // Xử lý xóa ảnh
  const handleRemoveImage = (index) => {
    const newPreviewImages = [...previewImages];
    const newImageUploads = [...imageUploads];
    newPreviewImages.splice(index, 1); // Xóa ảnh trong preview
    newImageUploads.splice(index, 1); // Xóa ảnh trong danh sách đã chọn
    setPreviewImages(newPreviewImages);
    setImageUploads(newImageUploads);
  };

  const onSubmit = async (data) => {
    try {
      const imageUrls = await uploadImages(imageUploads);
      const updatedData = {
        ...data,
        category_id: selectedCategory?.value,
        category_name: selectedCategory?.label,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        thumbnail_url: imageUrls[0]?.thumbnail_url || previewImages[0],
        price: parseFloat(data.original_price) * (1 - data.discount_rate / 100),
        url_key: slugify(data.name, { lower: true, strict: true }),
      };

      console.log('Updated product data:', updatedData);

      const response = await updateProduct(axiosPrivate, productId, updatedData);
      alert(`${response.message}`);
      window.location.reload();
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Có lỗi xảy ra khi cập nhật sản phẩm!');
    }
  };

  const handleSearchChange = (inputValue) => {
    setSearchTerm(inputValue);
    loadCategories(inputValue, 1); // Gọi lại API để tìm kiếm và lấy trang 1
  };

  return (
    <>
      <div className="relative">
        {/* Back button */}
        <button
          onClick={() => navigate(-1)}  // Go back to the previous page
          className="absolute top-1 left-1 text-white bg-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-700"
        >
          <FaArrowLeft size={20} />
        </button>
      </div>
      <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <h2 className="text-2xl text-center font-semibold mb-6">Chỉnh Sửa Sản Phẩm</h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Các trường form */}
          <div>
            <label className="block text-sm font-medium">Tên sản phẩm</label>
            <input
              {...register('name')}
              type="text"
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
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

          <div>
            <label className="block font-medium mb-1">Ảnh sản phẩm</label>
            <div className="mt-2">
              {/* Hiển thị số lượng tệp được chọn */}
              {previewImages.length > 0 ? (
                <p>{previewImages.length} tệp đã chọn</p>
              ) : (
                <p>Không có tệp nào được chọn</p>
              )}
            </div>
            {/* Hiển thị các ảnh đã chọn */}
            {previewImages.length > 0 && (
              <div className="mt-4 flex space-x-4">
                {previewImages.map((src, index) => (
                  <div key={index} className="relative">
                    <img src={src} alt={`preview-${index}`} className="w-24 h-24 rounded" />
                    {/* Nút X để xóa ảnh */}
                    <button
                      type="button"
                      onClick={() => handleRemoveImage(index)}
                      className="absolute top-0 right-0 bg-red-500 text-white p-1 rounded-full"
                    >
                      <FaTimes size={12} />
                    </button>
                  </div>
                ))}
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              multiple
              className="mt-2"
              onChange={handleImageChange}
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Tỷ lệ giảm giá (%)</label>
            <input
              {...register('discount_rate')}
              type="number"
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
            />
            {errors.discount_rate && <p className="text-red-500 text-sm">{errors.discount_rate.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Giá gốc</label>
            <input
              {...register('original_price')}
              type="number"
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
            />
            {errors.original_price && <p className="text-red-500 text-sm">{errors.original_price.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Miêu tả ngắn</label>
            <textarea
              {...register('short_description')}
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
            ></textarea>
            {errors.short_description && <p className="text-red-500 text-sm">{errors.short_description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Miêu tả chi tiết</label>
            <textarea
              {...register('description')}
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
            ></textarea>
            {errors.description && <p className="text-red-500 text-sm">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium">Thông số</label>
            <textarea
              {...register('specifications')}
              className="mt-1 block w-full border border-gray-300 p-2 rounded"
            ></textarea>
            {errors.specifications && <p className="text-red-500 text-sm">{errors.specifications.message}</p>}
          </div>


          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600"
          > 
            Lưu thay đổi
          </button>
        </form>
      </div>
    </>
  );
};

export default SellerEditProduct;
