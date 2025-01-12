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

export const getPotentialCustomer = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.get('/api/seller/orders/potential-customer');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch potential customer');
  }
}

export const getRecentOrders = async (axiosPrivate) => {
  try {
    const response = await axiosPrivate.get('/api/seller/orders/recent');
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch recent orders');
  }
};

export const getMonthlyRevenue = async (axiosPrivate, selectedYear) => {
  try {
    const response = await axiosPrivate.get(`/api/seller/orders/monthly-revenue`, {
      params: { year: selectedYear.value },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || 'Failed to fetch monthly revenue');
  }
}