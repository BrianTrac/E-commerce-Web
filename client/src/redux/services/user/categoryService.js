import axios from '../../../config/axios';

const getChildrenCategories = async ({parentId}) => {
    const response = await axios.get(`api/categories?include=children&parent_id=${parentId}`,
        {
            withCredentials: true
        }
    );
    
    return response.data;
}

const getAncestorCategories = async ({id}) => {
    const response = await axios.get(`api/categories?include=ancestor&parent_id=${id}`,
        {
            withCredentials: true
        }
    );
    
    return response.data;
}

export default {
    getChildrenCategories,
    getAncestorCategories,
};