import axios from '../config/axios';

const fetchStoreDetails = async (storeId, page = 1, limit = 24, query = '', sort = 'popular') => {
    try {
        const response = await axios.get(`/api/store/${storeId}`, {
            params: { page, limit, query, sort },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching store details:', error);
        throw error;
    }
};



export { fetchStoreDetails };
