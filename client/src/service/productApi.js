import axios from '../config/axios';

const getTopDeals = async ({ limit = 36, page = 1 } = {}) => {
  const response = await axios.get(`api/products/top_deals?limit=${limit}&page=${page}`);
  return response.data.data;
};

const getFlashSale = async ({ limit = 36, page = 1 } = {}) => {
  const response = await axios.get(`api/products/flash_sale?limit=${limit}&page=${page}`);
  return response.data.data;
};

const fetchProductByCategory = async (
  {
    category,
    limit = 24,
    page = 1,
    sort = 'default',
    rating,
    price,
  }) => {

  if (!category) {
    throw new Error('Category is required parameter');
  }

  const params = new URLSearchParams();

  params.append('category', category);
  params.append('limit', limit);
  params.append('page', page);
  params.append('sort', sort);

  if (rating) {
    params.append('rating', rating);
  }

  if (price) {
    params.append('price', price);
  }

  try {
    const response = await axios.get(`api/categories/listings?${params.toString()}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product by category', error);
    throw error;
  }

};

const fetchProductById = async (id) => {
  try {
    const response = await axios.get(`api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product by id', error);
    throw error;
  }
}

const fetchProductReviews = async (id) => {
  try {
    const response = await fetch(`https://tiki.vn/api/v2/reviews?product_id=${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed to fetch product reviews', error);
    throw error;
  }
};

const fetchRelatedProducts = async (id) => {
  try {
    const response = await axios.get(`api/products/${id}/related`);
    if (response.status !== 200) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return response.data; 
  } catch (error) {
    console.error('Failed to fetch related products', error);
    throw error;
  }
};

export {
  getTopDeals,
  getFlashSale,
  fetchProductByCategory,
  fetchProductById,
  fetchProductReviews,
  fetchRelatedProducts,
};