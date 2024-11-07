
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, clearError, clearSuccess } from "../../redux/reducers/user/authReducer";
import { resetPassword } from "../../redux/actions/user/authAction";


const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email'); // Extract `email` from query params
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();
    const dispatch = useDispatch();

     // Check if password and confirm password match
     useEffect(() => {
        if (newPassword !== confirmPassword && confirmPassword) {
            setPasswordsMatch(false);
        } else {
            setPasswordsMatch(true);
        }
    }, [newPassword, confirmPassword]);

    const toggleNewPassword = () => {
        setShowNewPassword(!showNewPassword);
    }

    const toggleConfirmPassword = () => {
        setShowConfirmPassword(!showConfirmPassword);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        try {
            await dispatch(resetPassword({ email, newPassword }));
            setSuccess("Password reset successfully. Redirecting to login page...");
            
            // Optional: Redirect to login page after successful password reset
            setTimeout(() => {
                navigate('/auth/login');
            }, 2000);

        } catch (err) {
            setError('Error resetting password. Please try again.');
        }
    };

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-20">
                <ShoppingCart className='text-orange-500' size={32} />
                <h2 className="absolute left-1/2 transform -translate-x-1/2 text-2xl font-semibold">
                    Reset Your Password
                </h2>
            </div>
            
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-md mx-auto">
                
                <div className="relative">
                    <input
                        type={showNewPassword ? 'text' : 'password'}
                        id="password"
                        placeholder="Password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className="p-2 border border-gray-300 rounded w-full pr-10"
                        required
                    />
                    <button
                            type='button'
                            onClick={toggleNewPassword}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center">
                            {showNewPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
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
                        required
                    />
                    <button
                        type='button'
                        onClick={toggleConfirmPassword}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center">
                        {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                </div>
                {!passwordsMatch && <p className="text-red-500 text-sm mt-1">Passwords do not match</p>}
                <button
                    type="submit"
                    disabled={!passwordsMatch}   
                    className={`bg-blue-500 text-white p-2 rounded ${!passwordsMatch ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                    
                    Reset Password
                </button>
            </form>
            {error && <p className="text-red-500 text-center mt-8">{error}</p>}
            {success && <p className="text-green-500 text-center mt-8">{success}</p>}
        </div>
    );
};

export default ResetPassword;
