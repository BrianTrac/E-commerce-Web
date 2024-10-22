import { useState, useEffect } from "react";
import axios from "../config/axios";
import { useNavigate } from "react-router-dom";
import {ArrowLeft, X, ShoppingCart} from 'lucide-react';

const Toast = ({ message, type, onClose }) => (
    <div className={`fixed top-4 right-4 p-4 rounded-md shadow-md flex items-center justify-between ${type === 'error' ? 'bg-red-500' : 'bg-green-500'} text-white`}>
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        <X size={18} />
      </button>
    </div>
);

const ForgetPassword = () => {
    const [email, setEmail] = useState('');
    const [toast, setToast] = useState({ show: false, message: '', type: '' });
    const navigate = useNavigate();

    const showToast = (message, type) => {
        setToast({ show: true, message, type });
    };
    
    useEffect(() => {
        if (toast.show) {
          const timer = setTimeout(() => {
            setToast({ show: false, message: '', type: '' });
          }, 3000);
          return () => clearTimeout(timer);
        }
      }, [toast.show]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const response = await axios.post('/api/auth/forget-password',
                JSON.stringify({ email }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            showToast('Password reset email sent successfully! Please check your inbox!', 'success');
            setTimeout(() => {
              navigate('/auth/login');
            }, 3000);

        } catch (err) {
          if (!err.response) {
            return showToast('Network error. Please try again later.', 'error');
          }
          else {
            return showToast(err.response.data.message, 'error');
          }  
        }
    };

  return (
    <>
      <ShoppingCart className='text-orange-500 mt-4 ml-4' size={32} />
      <div className="flex justify-center items-center w-screen bg-gray-50">
          
          <div className="bg-white p-8 shadow-xl mx-auto w-full max-w-md rounded-2xl mt-32">
            <div className="flex items-center mb-6">
              <ArrowLeft className="text-gray-500 cursor-pointer" onClick={() => navigate(-1)} />
              <h2 className="text-2xl font-bold ml-4">Đặt lại mật khẩu</h2>
            </div>
    
            <form onSubmit={handleSubmit}>
              <input
                type="text"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mb-4 w-full px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:shadow-outline"
              />
                <button
                        type="submit"
                        className="w-full px-4 py-2 font-bold text-white bg-red-400 rounded-full hover:bg-red-500 focus:outline-none focus:shadow-outline"
                >
                    TIẾP THEO
              </button>
            </form>
            </div>
            {toast.show && (
                <Toast
                message={toast.message}
                type={toast.type}
                onClose={() => setToast({ show: false, message: '', type: '' })}
                />
            )}
        </div>
      </>
    );
};

export default ForgetPassword;  