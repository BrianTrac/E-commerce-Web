import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import slugify from 'slugify'; // Dùng để chuyển tên thành slug
import { getProductById, updateProduct } from '../../service/seller/productApi'; // Import API
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../../utils/firebase';
import { v4 } from 'uuid';
import { FaArrowLeft } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import { getAllCategories } from '../../service/seller/categoryApi';

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

  const [categories, setCategories] = useState([]);
  const [previewImages, setPreviewImages] = useState([]);
  const [imageUploads, setImageUploads] = useState([]);

  const navigate = useNavigate();

  // Load product details and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await getProductById(productId);
        const product = productResponse.data;

        console.log('Product', product);

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

        // Load categories
        const categoriesResponse = await getAllCategories({ page: 1, limit: 10 });
        setCategories(categoriesResponse.data);

        console.log(categoriesResponse.data);

        // Set initial category
        const initialCategory = categoriesResponse.data.find(
          (category) => category.id === product.id
        );

        console.log(initialCategory);
        setValue('category', initialCategory);
      } catch (error) {
        console.error('Error loading product or categories:', error);
        alert('Không thể tải dữ liệu sản phẩm hoặc danh mục!');
      }
    };

    fetchData();
  }, [productId, setValue]);

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
      .then((previews) => setPreviewImages([...previewImages, ...previews]))
      .catch((error) => console.error('Error reading files:', error));
  };

  const uploadImages = async () => {
    if (imageUploads.length === 0) return [];
    const uploadPromises = imageUploads.map(async (image) => {
      const imageRef = ref(storage, `products/${image.name + v4()}`);
      const snapshot = await uploadBytes(imageRef, image);
      const downloadURL = await getDownloadURL(snapshot.ref);
      return { thumbnail_url: downloadURL };
    });
    return Promise.all(uploadPromises);
  };

  // Gửi dữ liệu chỉnh sửa lên server
  const onSubmit = async (data) => {
    try {
      const imageUrls = await uploadImages();
      const updatedData = {
        ...data,
        category_id: data.category.id,
        category_name: data.category.name,
        images: imageUrls.length > 0 ? imageUrls : undefined,
        thumbnail_url: imageUrls[0]?.thumbnail_url || previewImages[0],
        price: parseFloat(data.original_price) * (1 - data.discount_rate / 100),
        url_key: slugify(data.name, { lower: true, strict: true }),
      };

      await updateProduct(productId, updatedData);
      alert('Cập nhật sản phẩm thành công!');
    } catch (error) {
      console.error('Failed to update product:', error);
      alert('Có lỗi xảy ra khi cập nhật sản phẩm!');
    }
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

          <div>
            <label>Danh mục</label>
            <Controller
              name="category"
              control={control}
              render={({ field }) => (
                <select
                  {...field}
                  value={field.value?.id || ''}
                  onChange={(e) => {
                    const selectedCategory = categories.find(
                      (cat) => cat.id === parseInt(e.target.value)
                    );
                    field.onChange(selectedCategory);
                  }}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map((category) => (
                    <option key={category.id} value={category.id}>
                      {category.name}
                    </option>
                  ))}
                </select>
              )}
            />
          </div>

          <div>
            <label>Ảnh sản phẩm</label>
            <input type="file" accept="image/*" multiple onChange={handleImageChange} />
            <div className="flex space-x-4 mt-4">
              {previewImages.map((src, index) => (
                <img key={index} src={src} alt={`preview-${index}`} className="w-24 h-24 rounded" />
              ))}
            </div>
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
