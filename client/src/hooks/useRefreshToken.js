import { useSelector, useDispatch } from 'react-redux';
import { refreshToken } from '../redux/actions/user/authAction';


const useRefreshToken = () => {
   
    const dispatch = useDispatch();
  
    const refresh = async () => {
        try {
            const resultAction = await dispatch(refreshToken());

            if (refreshToken.fulfilled.match(resultAction)) {
                return resultAction.payload.accessToken; // Updated access token
            } else {
                throw new Error('Token refresh failed');
            }
        } catch (err) {
            console.error('Refresh token failed:', err);
            return null;
        }
    };

    return refresh;
};

export default useRefreshToken;