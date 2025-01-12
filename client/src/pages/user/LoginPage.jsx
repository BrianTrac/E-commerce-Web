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
    // get type of login from query params
    const type = new URLSearchParams(location.search).get('type') || 'user';

    // Access Redux state 
    const  {user, error, loading, isAuthenticated} = useSelector(selectAuth);
    const [errorChanged, setErrorChanged] = useState('');
    
    useEffect(() => {
        setErrorChanged(error);
    }, [error]); // This ensures the state is updated only when `error` changes


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
                else if (type === 'user' && user.role && user.role.includes('User')) {
                    navigate('/', { replace: true });
                }
                else if (type === 'seller' && user.role && user.role.includes('Seller')) {
                    navigate('/Seller', { replace: true });
                }
                else {
                    setErrorChanged('invalid credentials');       
                    // clear user in redux
                }
            }
        }
    }, [isAuthenticated, user, from, navigate]);


    const handleSubmit = async(e) => {
        e.preventDefault();   
        
        await dispatch(login({ username, password, type }));
        console.log('login' + username + password + type);

        setUsername('');
        setPassword('');    
    }

    const handleGoogleLogin = () => {
        const typeParam = encodeURIComponent(type.toLowerCase()); // Ensure the type is URL-safe
        window.location.href = `${SERVER_URL}/api/auth/google?type=${typeParam}`;
    };

    return (
        <div className="bg-white p-8 relative w-96">
            <h2 className="font-semibold text-xl text-center mb-8">
                Login
                {type && <span className="font-semibold text-xl text-center mb-8"> as {type}</span>
                }
            </h2>
            {errorChanged && <p className="text-red-500 text-sm text-center">{errorChanged}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6 max-w-sm mx-auto">
                <input
                    type="text"
                    id="username"
                    placeholder="Username/Email"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                    
                />
                <div className="relative">
                    <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full pr-10"
                        
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
                    disabled={!username || !password}
                >
                    Login
                </button>
                <p className='text-sm text-blue-600 text-right'>
                    <Link to="/auth/forget-password" className="hover:underline">Forget Password</Link>
                </p> 
                <div className="w-full border-t border-gray-800"></div>
                { type.toLowerCase() !== 'admin' &&
                    <div className="flex">
                        <button
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-500 mr-4 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            type="button"
                        >
                            <Facebook className="h-5 w-5 mr-2 text-blue-800" />
                            Facebook
                        </button>
                        <button
                            onClick={handleGoogleLogin}
                            className="w-full flex items-center justify-center px-4 py-2 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            type="button"
                        >
                            <FcGoogle className="h-5 w-5 mr-2" />
                            Google
                        </button>
                    </div>
                }
                {/* Admin can not register */}
                {type.toLowerCase() !== 'admin' &&
                    <div className="mt-6 text-center text-sm">
                        <span className="text-gray-600">You are new to Shobee? </span>
                        <Link 
                            to={`/auth/register?type=${type.toLowerCase()}`} 
                            className="font-medium text-blue-500 hover:text-blue-700 hover:underline"
                        >
                            Register
                        </Link>
                    </div>
                }
            </form>   
        </div>
    );
};

export default Login;