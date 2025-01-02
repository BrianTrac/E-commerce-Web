export const getOrders = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.get('/api/seller/orders');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch orders');
  }
};

export const updateOrderStatus = async (axiosPrivate, orderId, status) => {
  try {
    const response = await axiosPrivate.patch(`/api/seller/orders/${orderId}`, { status });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to update order status');
  }
};