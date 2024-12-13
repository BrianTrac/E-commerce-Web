import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, X, ShoppingCart } from 'lucide-react';
import { useDispatch, useSelector } from "react-redux";
import { selectAuth, clearError, clearSuccess } from "../../redux/reducers/user/authReducer";
import { forgotPassword } from "../../redux/actions/user/authAction";

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
  const dispatch = useDispatch();
  const { error, success } = useSelector(selectAuth);

  const showToast = (message, type) => {
      setToast({ show: true, message, type });
  };

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);
  
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

      await dispatch(forgotPassword({ email }));
        
      if (success) {
        showToast('Password reset email sent successfully! Please check your inbox!', 'success');
        setTimeout(() => { navigate('/auth/login'); }, 2000);
      }

      if (error) {
        showToast(error, 'error');
      }

    } catch (err) {
      if (!err.response) {
        return showToast('Network error. Please try again later.', 'error');
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