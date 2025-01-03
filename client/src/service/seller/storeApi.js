// services/productApi.js
export const getStore = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.get(`/api/seller/store`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch seller info');
  }
};

export const updateStore = async (axiosPrivate, store) => {
  try {
    const response = await axiosPrivate.patch(`/api/seller/store/update`, store);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update seller info');
  }
}