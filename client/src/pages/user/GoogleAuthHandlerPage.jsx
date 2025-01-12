import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
//import useAuth from '../../hooks/useAuth';
import { jwtDecode } from 'jwt-decode';

const GoogleAuthHandler = () => {
    const navigate = useNavigate();
//    const { setAuth } = useAuth();

    useEffect(() => {
        // the backend sends back the token in the URL query string after Google login
        const urlParams = new URLSearchParams(window.location.search);
        const accessToken = urlParams.get('accessToken');
        console.log('accessToken:', accessToken);
        console.log('urlParams:', urlParams);
        if (accessToken) {
            const decodedToken = jwtDecode(accessToken);
            const userRole = decodedToken?.role;

            // Store token and user data in auth state
        //    setAuth({ accessToken });
            console.log('decodedToken:', decodedToken);
            if (userRole && userRole.includes('Admin')) {
                navigate('/Admin', { replace: true });
            }  else if (userRole && userRole.includes('Seller')) {
                navigate('/Seller', { replace: true });
            }
            else {
                navigate('/', { replace: true });
            }
        }
    }, [navigate]);

    // Display a loading message while the user is being redirected
    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
            <h1 className="ml-4 text-xl">Loading...</h1>
        </div>
    );
};

export default GoogleAuthHandler;
