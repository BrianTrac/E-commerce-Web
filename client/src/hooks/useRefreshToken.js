import axios from '../config/axios';
import useAuth from './useAuth';

const useRefreshToken = () => {
    const { setAuth } = useAuth();    
    
    const refreshToken = async () => {
        const response = await axios.get('api/auth/token/refresh', {
            withCredentials: true,
        });

        setAuth(prev => {
            return {
                ...prev,
                role: response?.data?.role,
                accessToken: response?.data?.accessToken
            };
        });

        return response.data.accessToken;
    };

    return refreshToken;
};

export default useRefreshToken;