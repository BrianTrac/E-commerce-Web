import { Eye, EyeOff, Facebook } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
//import axios from '../config/axios';
import { toast } from 'react-toastify';
import SERVER_URL from '../../config/config';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, clearError, clearSuccess } from '../../redux/reducers/user/authReducer';
import { register } from '../../redux/actions/user/authAction';

const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [disable, setDisable] = useState(true);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user, error, loading, success } = useSelector(selectAuth);

    // Enable or disable the Register button
    useEffect(() => {
        if (passwordsMatch && !loading && username && email && password && confirmPassword) 
            setDisable(false);
        else
            setDisable(true);
    }, [passwordsMatch, loading, username, email, password, confirmPassword]);


    // Clear any error or success on component load
    useEffect(() => {
        dispatch(clearError());
        dispatch(clearSuccess());
    }, [dispatch]);

    // Check if password and confirm password match
    useEffect(() => {
        if (password !== confirmPassword && confirmPassword) {
            setPasswordsMatch(false);
        } else {
            setPasswordsMatch(true);
        }
    }, [password, confirmPassword]);

    const togglePassword = () => {
        setShowPassword(!showPassword);
    }

    const toggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await dispatch(register({ username, email, password }));
            // Clear form fields
            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
        } catch (error) {
            console.error('Registration submission error:', error);
            toast.error('An error occurred during registration. Please try again.');
        }
    };
    
     // Handle success/error messages
     useEffect(() => {
        let mounted = true;

        if (success && mounted) {
            const handleSuccess = async () => {
                try {
                    toast.success(success);
                    // First clear the success state
                    await dispatch(clearSuccess());
                    // Then navigate after a short delay
                    
                    navigate(`/auth/register/verify-otp?email=${email}`);
                    
                    
                } catch (err) {
                    console.error('Error handling success state:', err);
                }
            };
            handleSuccess();
        }

        if (error && mounted) {
            toast.error(error);
            dispatch(clearError());
        }

        // Cleanup function to prevent state updates after unmount
        return () => {
            mounted = false;
        };
    }, [success, error, dispatch, navigate]);

    const handleGoogleLogin = () => {
        window.location.href = `${SERVER_URL}/api/auth/google`;
    }

    return (
        <div className="bg-white p-8 relative w-96">
            <h2 className="font-semibold text-xl text-center mb-8">Register</h2>
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-6 max-w-sm mx-auto">
                <input
                    type="text"
                    id="username"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="p-2 border border-gray-300 rounded w-full"
                />
                <input
                    type="email"
                    id="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                <div className="relative">
                    <input
                        type={showConfirmPassword ? 'text' : 'password'}
                        id="confirmPassword"
                        placeholder="Confirm Password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full pr-10"
                    />
                    <button
                        type='button'
                        onClick={toggleConfirmPassword}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                    {!passwordsMatch && <p className="absolute text-red-500 text-sm mt-1">Passwords do not match</p>}
                </div>
                <button
                    type='submit'
                    className={`bg-cyan-500 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-50 hover:bg-cyan-700 transition-colors duration-300 mt-2 ${disable ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={disable}
                >
                    Register
                </button>
                <div className="w-full border-t border-gray-800"></div>
                <div className="flex">
                    <button
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-500 mr-4 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Facebook className="h-5 w-5 mr-2 text-blue-800" />
                        Facebook
                    </button>
                    <button
                        className="w-full flex items-center justify-center px-4 py-2 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                        onClick={handleGoogleLogin}
                    >
                        <FcGoogle className="h-5 w-5 mr-2" />
                        Google
                    </button>
                </div>
                <div className="mt-6 text-center text-sm">
                    <span className="text-gray-600">Already have an account? </span>
                    <Link to="/auth/login" className="font-medium text-blue-500 hover:text-blue-700 hover:underline">
                        Login
                    </Link>
                </div>
            </form>
        </div>
    );
};

export default Register;
