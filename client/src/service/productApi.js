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
    debugger
    const response = await axios.get(`api/products/${id}`);
    return response.data;
  } catch (error) {
    console.error('Failed to fetch product by id', error);
    throw error;
  }
}

// const API_URL = 'http://localhost:4000/api/admin';

// const sellerApi = {
//   getProducts: async (sellerId, params = {}) => {
//     const { page = 1, limit = 10, search = '' } = params;
//     const queryParams = new URLSearchParams({
//       page,
//       limit,
//       search
//     }).toString();

//     const response = await fetch(`${API_URL}/seller/${sellerId}/products?${queryParams}`);

//     if (!response.ok) {
//       throw new Error(response.statusText);
//     }

//     return await response.json();
//   },

//   deleteProduct: async (sellerId, productId) => {
//     const response = await fetch(`${API_URL}/seller/${sellerId}/products/${productId}`, {
//       method: 'DELETE'
//     });

//     if (!response.ok) {
//       throw new Error('Failed to delete product');
//     }

//     return await response.json();
//   }
// };

export {
  getTopDeals,
  getFlashSale,
  fetchProductByCategory,
  fetchProductById,
  // sellerApi
};