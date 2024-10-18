
import { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from '../config/axios';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const email = searchParams.get('email'); // Extract `email` from query params
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        
        try {
            const response = await axios.post('/api/auth/reset-password',
                JSON.stringify({ email, newPassword }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );
            setSuccess(response.data.message);
            
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
            <h2 className="text-xl font-bold mb-4">Reset Your Password</h2>
            {error && <p className="text-red-500">{error}</p>}
            {success && <p className="text-green-500">{success}</p>}
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4 max-w-md mx-auto">
                <label htmlFor="newPassword">New Password:</label>
                <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <label htmlFor="confirmPassword">Confirm Password:</label>
                <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="border p-2 rounded"
                    required
                />
                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Reset Password
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;
