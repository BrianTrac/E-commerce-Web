import axios from '../../../config/axios';

// get suggestion each time user type in search bar
// GET /api/products/search/suggestion?q=apple
const getSuggestions = async ({ keyword }) => {
    const response = await axios.get(`api/products/search/suggestion?q=${keyword}`,
        {
            withCredentials: true
        }
    );

    return response.data;
}

// GET /api/products?limit=24&page=1&q=apple&rating=4,5&price=100,200&sort=default(popular)||price,asc||price,desc||newest||top_seller
export const getSearchResults = async (
    {
        keyword,
        limit = 24,
        page = 1,
        sort = 'default',
        rating,
        price,
    }) => {
    
    if (!keyword) {
        throw new Error('Keyword is required parameter');
    }
    
    const params = new URLSearchParams();

    params.append('q', keyword);
    params.append('limit', limit);
    params.append('page', page);
    params.append('sort', sort);

    if (rating) {
        params.append('rating', rating);
    }


    if (price) {
        params.append('price', price);
    }
    
    const response = await axios.get(`api/products?${params.toString()}`,
        {
            withCredentials: true
        }   
    );

    return response.data;
}

export default {
    getSuggestions,
};