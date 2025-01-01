import React, { useState, useEffect } from 'react';
import { getSellerInfo, updateSellerInfo } from '../../service/seller/sellerApi';
import { FaPhone, FaMapMarkerAlt, FaClock, FaCreditCard, FaRegIdBadge, FaEdit, FaStar } from 'react-icons/fa';
import { getStore, updateStore } from '../../service/seller/storeApi';
import { getTopSellingProducts } from '../../service/seller/productApi';
import TopProducts from '../../components/seller/TopProducts';
import useAxiosPrivate from '../../hooks/useAxiosPrivate';
import { uploadImages } from '../../helpers/upload';

const SellerInfo = () => {
  const [sellerInfo, setSellerInfo] = useState(null);
  const [store, setStore] = useState(null);
  const [topProducts, setTopProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isEditingSeller, setIsEditingSeller] = useState(false);
  const [isEditingStore, setIsEditingStore] = useState(false);
  const [originalSellerInfo, setOriginalSellerInfo] = useState(null);
  const [originalStoreInfo, setOriginalStoreInfo] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    const fetchSellerInfo = async () => {
      try {
        const info = await getSellerInfo(axiosPrivate);
        setSellerInfo(info);
        setOriginalSellerInfo(info);
        const storeId = info.store_id;
        const products = await getTopSellingProducts(axiosPrivate, storeId);
        setTopProducts(products.data);
      } catch (err) {
        setError(err.message || 'Failed to load seller info');
      } finally {
        setLoading(false);
      }
    };

    const fetchStore = async () => {
      try {
        const store = await getStore(axiosPrivate);
        setStore(store);
        setOriginalStoreInfo(store);
      } catch (err) {
        setError(err.message || 'Failed to load store info');
      }
    };


    fetchSellerInfo();
    fetchStore();
  }, [axiosPrivate]);

  const handleEditSeller = () => {
    setIsEditingSeller(true);
  };

  const handleEditStore = () => {
    setIsEditingStore(true);
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file)); // Show image preview
    }
  };

  const handleSaveSeller = async () => {
    try {
      const response = await updateSellerInfo(axiosPrivate, sellerInfo);
      alert(`${response.message}`);
      setOriginalSellerInfo(sellerInfo); // Đồng bộ thông tin gốc
      setIsEditingSeller(false);
    } catch (err) {
      setError('Failed to save seller info');
    }
  };


  const handleSaveStore = async () => {
    try {
      let updatedStore = store;
  
      // Upload logo nếu có thay đổi
      if (logoFile) {
        const uploadedImages = await uploadImages([logoFile], 'sellers'); // Sử dụng thư mục 'sellers'
        updatedStore = { ...updatedStore, icon: uploadedImages[0].thumbnail_url };
      }
  
      const response = await updateStore(axiosPrivate, updatedStore);
      alert(`${response.message}`);
      setOriginalStoreInfo(updatedStore); // Đồng bộ thông tin gốc
      setLogoFile(null); // Reset file logo
      setLogoPreview(null); // Reset preview logo
      setIsEditingStore(false);
    } catch (err) {
      setError('Failed to save store info');
    }
  };

  const handleCancelSeller = () => {
    setSellerInfo(originalSellerInfo);  // Reset to original data
    setIsEditingSeller(false);
  };

  const handleCancelStore = () => {
    setStore(originalStoreInfo);  // Reset to original data
    setIsEditingStore(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSellerInfo({ ...sellerInfo, [name]: value });
  };

  const handleChangeStore = (e) => {
    const { name, value } = e.target;
    setStore({ ...store, [name]: value });
  };

  if (loading) {
    return <div className="text-center">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-red-500">{error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg space-y-8">
      {/* Seller Info Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold">Seller Information</h2>
        {/* Display Username and Email */}
        <div className="flex items-center space-x-3">
          <span className="font-medium text-gray-700">Username:</span>
          <input
            type="text"
            name="username"
            value={sellerInfo.username || ''}
            className="text-gray-500 w-full border-b border-gray-300"
            disabled={true}
          />
        </div>
        <div className="flex items-center space-x-3">
          <span className="font-medium text-gray-700">Email:</span>
          <input
            type="email"
            name="email"
            value={sellerInfo.email || ''}
            className="text-gray-500 w-full border-b border-gray-300"
            disabled={true}
          />
        </div>

        {/* Editable Seller Fields */}
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <FaPhone className="text-gray-500" />
            <input
              type="text"
              name="phone"
              value={sellerInfo.phone || ''}
              onChange={handleChange}
              className="text-gray-700 w-full border-b border-gray-300"
              disabled={!isEditingSeller}
            />
          </div>
          <div className="flex items-center space-x-3">
            <FaMapMarkerAlt className="text-gray-500" />
            <input
              type="text"
              name="address"
              value={sellerInfo.address || ''}
              onChange={handleChange}
              className="text-gray-700 w-full border-b border-gray-300"
              disabled={!isEditingSeller}
            />
          </div>
          <div className="flex items-center space-x-3">
            <FaClock className="text-gray-500" />
            <input
              type="text"
              name="working_time"
              value={sellerInfo.working_time || ''}
              onChange={handleChange}
              className="text-gray-700 w-full border-b border-gray-300"
              disabled={!isEditingSeller}
            />
          </div>
          <div className="flex items-center space-x-3">
            <FaCreditCard className="text-gray-500" />
            <input
              type="text"
              name="payment_info"
              value={sellerInfo.payment_info || ''}
              onChange={handleChange}
              className="text-gray-700 w-full border-b border-gray-300"
              disabled={!isEditingSeller}
            />
          </div>
          <div className="flex items-center space-x-3">
            <FaRegIdBadge className="text-gray-500" />
            <textarea
              name="description"
              value={sellerInfo.description || ''}
              onChange={handleChange}
              className="text-gray-700 w-full border-b border-gray-300"
              disabled={!isEditingSeller}
            />
          </div>
        </div>

        {/* Seller Info Edit Button */}
        <div className="flex space-x-4 mt-6 justify-center">
          {!isEditingSeller ? (
            <button
              onClick={handleEditSeller}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <FaEdit className="inline mr-2" /> Edit Seller Info
            </button>
          ) : (
            <>
              <button
                onClick={handleCancelSeller}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSeller}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save Seller Info
              </button>
            </>
          )}
        </div>
      </div>

      {/* Store Info Section */}
      <div className="space-y-6">
        <h2 className="text-3xl font-semibold">Store Information</h2>
        <div className="text-center mb-6">
          {/* Editable Store Logo */}
          {isEditingStore ? (
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleLogoChange}
                className="mb-4"
              />
              {logoPreview && (
                <img
                  src={logoPreview}
                  alt="Logo Preview"
                  className="w-32 h-32 object-cover mx-auto rounded-full"
                />
              )}
            </div>
          ) : (
            <img
              src={store.icon || '/path/to/default/logo.png'}
              alt="Store Logo"
              className="w-32 h-32 mx-auto rounded-full"
            />
          )}

          {/* Editable Store Name */}
          <div className="mt-4">
            {!isEditingStore ? (
              <h3 className="text-xl font-medium">{store.name}</h3>
            ) : (
              <input
                type="text"
                name="name"
                value={store.name || ''}
                onChange={handleChangeStore}
                className="text-xl font-medium w-full border-b border-gray-300"
              />
            )}
          </div>

          {/* Rating and Followers */}
          <div className="flex justify-center items-center space-x-4 mt-4">
            <div className="flex items-center space-x-2">
              <FaStar className="text-yellow-500" />
              <span className="font-medium">{store.avg_rating_point}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="font-medium">Followers:</span>
              <span className="text-gray-500">{store.total_follower}</span>
            </div>
          </div>
        </div>

        {/* Store Info Edit Button */}
        <div className="flex space-x-4 mt-6 justify-center">
          {!isEditingStore ? (
            <button
              onClick={handleEditStore}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              <FaEdit className="inline mr-2" /> Edit Store Info
            </button>
          ) : (
            <>
              <button
                onClick={handleCancelStore}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveStore}
                className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Save Store Info
              </button>
            </>
          )}
        </div>
      </div>

      <TopProducts products={topProducts} />

    </div>
  );
};

export default SellerInfo;
