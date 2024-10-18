import { Eye, EyeOff, Facebook } from 'lucide-react';
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { toast } from 'react-toastify';



const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const navigate = useNavigate();

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
        setError('');

        try {
            await axios.post('/api/auth/register', 
                JSON.stringify({ username, email, password }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            setUsername('');
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            setError('');

            // direct to Email Verification page
            // Ensure toast is configured correctly
            toast.success('Registration successful! Please check your email to verify.');
            navigate('/auth/verify-email', { state: { email, type: 'register' } });
              
        } catch (err) {
            if (!err?.response) {
                setError('Network error. Please try again later.');
            } else if (err.response?.status === 409) {
                setError('User already exists');
            }
            else {
                setError('An error occurred. Please try again later.');
            }
        }
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
                    className={`bg-cyan-500 text-white p-2 rounded focus:outline-none focus:ring-2 focus:ring-slate-700 focus:ring-opacity-50 hover:bg-cyan-700 transition-colors duration-300 mt-2 ${!passwordsMatch ? 'opacity-50 cursor-not-allowed' : ''}`}
                    disabled={!passwordsMatch}
                >
                    Register
                </button>
                <div className="w-full border-t border-gray-800"></div>
                <div className="flex">
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-500 mr-4 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <Facebook className="h-5 w-5 mr-2 text-blue-800" />
                        Facebook
                    </button>
                    <button className="w-full flex items-center justify-center px-4 py-2 border border-gray-500 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
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
