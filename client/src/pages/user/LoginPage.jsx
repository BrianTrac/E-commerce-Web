import { Eye, EyeOff, Facebook, } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../../redux/actions/user/authAction';
import SERVER_URL from '../../config/config';
import { selectAuth, clearError, clearSuccess } from '../../redux/reducers/user/authReducer';

const Login = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/';
    const dispatch = useDispatch();
    // Access Redux state 
    const {user, error, loading, isAuthenticated} = useSelector(selectAuth);
    
    // Clear any error or success on component load
    useEffect(() => {
        dispatch(clearError());
        dispatch(clearSuccess());
    }, [dispatch]);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }
    
    useEffect(() => {
        if (isAuthenticated) {
            
            if (from && from !== '/') {
                navigate(from, { replace: true });
            } else {
                if (user.role && user.role.includes('Admin')) {
                    navigate('/Admin', { replace: true });
                }
                else if (user.role && user.role.includes('User')) {
                    navigate('/', { replace: true });
                }
                else if (user.role && user.role.includes('Seller')) {
                    navigate('/Seller', { replace: true });
                }
                else {
                    // navigate('/unauthorized', { replace: true });                    
                }
            }
        }
    }, [isAuthenticated, user, from, navigate]);


    const handleSubmit = async(e) => {
        e.preventDefault();   
        
        await dispatch(login({ username, password }));
        console.log('login' + username + password);

        setUsername('');
        setPassword('');    
    }

    const handleGoogleLogin = () => {
        window.location.href = `${SERVER_URL}/api/auth/google`;
    }

    return (
        <div className="bg-white p-8 relative w-96">
            <h2 className="font-semibold text-xl text-center mb-8">Login</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6 max-w-sm mx-auto">
                <input
                    type="text"
                    id="username"
                    placeholder="Username/Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                    disabled={loading}
                />
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full pr-10"
                        disabled={loading}
                    />
                    <button
                        type='button'
                        onClick={togglePassword}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                </div>
                <button
                    type='submit'
                    className="bg-cyan-500 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-50 hover:bg-cyan-700 transition-colors duration-300"
                    disabled={loading || !username || !password}
                >
                    Login
                </button>
                <p className='text-sm text-blue-600 text-right'>
                    <Link to="/auth/forget-password" className="hover:underline">Forget Password</Link>
                </p> 
                <div className="w-full border-t border-gray-800"></div>
            
                <div className="flex">
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-500 mr-4 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Facebook className="h-5 w-5 mr-2 text-blue-800" />
                        Facebook
                    </button>
                    <button
                        onClick={handleGoogleLogin}
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        <FcGoogle className="h-5 w-5 mr-2" />
                        Google
                    </button>
                </div>
      
                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-600">You are new to Shobee? </span>
                    <Link to="/auth/register" className="font-medium text-blue-500 hover:text-blue-700 hover:underline">
                     Register
                    </Link>
                </div>

            </form>   
        </div>
    );
};

export default Login;