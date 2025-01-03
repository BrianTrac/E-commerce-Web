const getOrders = async (axiosPrivate, page = 1, limit = 10) => {
    const response = await axiosPrivate.get('api/orders',
        {
            params: {
                page,
                limit,
            },
            withCredentials: true
        }
    );

    return response.data;
}

const getOrder = async (axiosPrivate, orderId) => {
    const response = await axiosPrivate.get(`api/orders/${orderId}`,
        {
            withCredentials: true
        }
    );

    return response.data;
}

const createOrder = async (axiosPrivate, orderItems, totalAmount, shippingAddress, paymentMethod) => {
    const response = await axiosPrivate.post('api/orders', 
        {
            orderItems,
            totalAmount,
            shippingAddress,
            paymentMethod,
        },
        {
            withCredentials: true
        }
    );

    return response.data;
}

const updateOrder = async (axiosPrivate, orderId, status, shippingAddress) => {
    const response = await axiosPrivate.post(`api/orders/${orderId}`,
        {
            status,
            shippingAddress
        },
        {
            withCredentials: true
        }
    );

    return response.data;
}

export { getOrders, getOrder, createOrder, updateOrder };