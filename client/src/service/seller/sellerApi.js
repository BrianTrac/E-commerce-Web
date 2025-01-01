// services/productApi.js

export const getSellerInfo = async (axiosPrivate) => {
    try {
      const response = await axiosPrivate.get(`/api/seller/info`);
      return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to fetch seller info');
    }
};

export const updateSellerInfo = async (axiosPrivate, sellerInfo) => {
    try {
        const response = await axiosPrivate.patch(`/api/seller/info/update`, sellerInfo);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.message || 'Failed to update seller info');
    }
}
