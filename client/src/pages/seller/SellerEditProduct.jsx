import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import slugify from 'slugify';
import { getProductById, updateProduct } from '../../service/seller/productApi';
import { FaArrowLeft, FaTimes } from 'react-icons/fa';
import { useNavigate, useParams } from 'react-router-dom';
import Select from 'react-select';
import useCategories from '../../hooks/useCategories';
import { uploadImages } from '../../helpers/upload';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';

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
  const { productId } = useParams();
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
  const [specifications, setSpecifications] = useState([]);

  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();

  const { categories, loadCategories } = useCategories(searchTerm, 1, 50);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const productResponse = await getProductById(axiosPrivate, productId);
        const product = productResponse.data;

        setValue('name', product.name);
        setValue('discount_rate', product.discount_rate);
        setValue('original_price', parseFloat(product.original_price));
        setValue('short_description', product.short_description);
        setValue('description', product.description);

        const parsedSpecifications = Array.isArray(product.specifications)
          ? product.specifications
          : JSON.parse(product.specifications || '[]');
        setSpecifications(parsedSpecifications);
        setValue('specifications', JSON.stringify(parsedSpecifications));

        setValue('qty', product.qty);

        // Set preview images
        if (product.thumbnails) {
          setPreviewImages(product.thumbnails);
        }

        // Set category
        setSelectedCategory({ value: product.category_id, label: product.category_name });
        setValue('category', { value: product.category_id, label: product.category_name });
      } catch (error) {
        console.error('Error loading product:', error);
        alert('Không thể tải dữ liệu sản phẩm!');
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
      .then((imagePreviews) => {
        setPreviewImages(imagePreviews);
      })
      .catch((error) => console.error('Error reading files:', error));
  };

  const handleSearchChange = (inputValue) => {
    setSearchTerm(inputValue);
    loadCategories(inputValue, 1); // Gọi lại API để tìm kiếm và lấy trang 1
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

  const handleAddSpec = () => {
    setSpecifications((prev) => [
      ...prev,
      { name: '', attributes: [{ code: '', name: '', value: '' }] },
    ]);
  };

  const handleRemoveSpec = (index) => {
    setSpecifications((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddRow = (specIndex) => {
    setSpecifications((prev) => {
      const updated = [...prev];
      updated[specIndex].attributes.push({ code: '', name: '', value: '' });
      return updated;
    });
  };

  const handleRemoveRow = (specIndex, attrIndex) => {
    setSpecifications((prev) => {
      const updated = [...prev];
      updated[specIndex].attributes.splice(attrIndex, 1);
      if (updated[specIndex].attributes.length === 0) {
        updated.splice(specIndex, 1);
      }
      return updated;
    });
  };

  const handleChange = (specIndex, attrIndex, field, value) => {
    setSpecifications((prev) => {
      const updated = [...prev];
      updated[specIndex].attributes[attrIndex][field] = value;
      return updated;
    });
  };

  const handleSpecNameChange = (specIndex, value) => {
    setSpecifications((prev) => {
      const updated = [...prev];
      updated[specIndex].name = value;
      return updated;
    });
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
        specifications,
      };

      const response = await updateProduct(axiosPrivate, productId, updatedData);
      alert(response.message);
      window.location.reload();
    } catch (error) {
      console.error('Error updating product:', error);
      alert('Có lỗi xảy ra khi cập nhật sản phẩm!');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <button
        onClick={() => navigate(-1)}
        className="text-white bg-gray-800 p-2 rounded-full"
      >
        <FaArrowLeft />
      </button>
      <h2 className="text-2xl text-center font-semibold mb-6">Chỉnh Sửa Sản Phẩm</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
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

        {/* Other form fields */}
        <div>
          <label>Thông số</label>
          {specifications.map((spec, specIndex) => (
            <div key={specIndex} className="mb-4 border rounded p-2">
              {/* Hiển thị tên nhóm bên ngoài */}
              <h3 className="text-lg font-semibold mb-2">{spec.name || 'Tên nhóm chưa có'}</h3>

              {/* Input để chỉnh sửa tên nhóm */}
              <input
                type="text"
                placeholder="Tên nhóm"
                value={spec.name}
                onChange={(e) => handleSpecNameChange(specIndex, e.target.value)}
                className="w-full p-2 mb-2 border rounded"
              />

              <table className="w-full">
                <thead>
                  <tr>
                    <th>Thuộc tính</th>
                    <th>Giá trị</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {spec.attributes.map((attr, attrIndex) => (
                    <tr key={attrIndex}>
                      <td>
                        <input
                          type="text"
                          value={attr.name}
                          onChange={(e) => handleChange(specIndex, attrIndex, 'name', e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          value={attr.value}
                          onChange={(e) => handleChange(specIndex, attrIndex, 'value', e.target.value)}
                          className="w-full p-2 border rounded"
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleRemoveRow(specIndex, attrIndex)}
                          className="text-red-500"
                        >
                          <FaTimes />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <button
                type="button"
                onClick={() => handleAddRow(specIndex)}
                className="text-blue-500 mt-2"
              >
                Thêm dòng
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={handleAddSpec}
            className="text-blue-500"
          >
            Thêm nhóm
          </button>
        </div>

        {/* Số lượng */}
        <div>
          <label className="block text-sm font-medium">Số lượng</label>
          <input
            {...register('qty')}
            type="number"
            className="mt-1 block w-full border border-gray-300 p-2 rounded"
          />
          {errors.qty && <p className="text-red-500 text-sm">{errors.qty.message}</p>}
        </div>
        <button type="submit" className="w-full bg-blue-500 p-3 rounded text-white">
          Lưu thay đổi
        </button>
      </form>
    </div>
  );
};

export default SellerEditProduct;
