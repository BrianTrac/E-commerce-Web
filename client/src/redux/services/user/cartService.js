const getCartItems = async (axiosPrivate) => {
    const response = await axiosPrivate.get('api/cart',
        {
            withCredentials: true
        }
    );

    return response.data;
}

const addToCardItem = async (axiosPrivate, { itemId, quantity, selected }) => {
    if (!quantity) {
        return;
    }
    const response = await axiosPrivate.post('api/cart/items', { itemId, quantity, selected },
        {
            withCredentials: true
        }
    );

    return response.data;
}

const updateCartItem = async (axiosPrivate, { itemId, quantity, selected }) => {
    if (!quantity) {
        return;
    }
    const response = await axiosPrivate.post(`api/cart/items/${itemId}`, { quantity, selected },
        {
            withCredentials: true
        }
    );

    return response.data;
}

const deleteCartItem = async (axiosPrivate, { itemIds }) => {
    const response = await axiosPrivate.post('api/cart/items/remove', {  itemIds  },
        {
            withCredentials: true
        }
    );

    if (response.status !== 200) {
        throw new Error('Could not delete cart item');
    }

    return response.data;
}

const getCartSummary = async (axiosPrivate) => {
    const response = await axiosPrivate.get('api/cart/items/summary',
        {
            withCredentials: true
        }
    );

    return response.data;
}

export {
    addToCardItem,
    getCartItems,
    updateCartItem,
    deleteCartItem,
    getCartSummary,
};

