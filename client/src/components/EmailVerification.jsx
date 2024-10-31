import { useState, useEffect } from 'react';
import axios from '../config/axios';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-toastify';

const EmailVerification = () => {
    const [OTPinput, setOTPinput] = useState(['', '', '', '', '', '']);
    const navigate = useNavigate();
    const location = useLocation();
    const [disable, setDisable] = useState(true);
    const [timer, setTimer] = useState(60);
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false); // Add loading state

    useEffect(() => {
        if (location.state) {
            setEmail(location.state.email);
            sendOTP();
        } else {
            navigate('/auth/register');
        }
    }, [location]);

  const sendOTP = async () => {
    if (loading) return;  // Prevent function if already loading
    setDisable(true);
    setTimer(60);
    setLoading(true);  // Set loading state to true
    try {
        const response = await axios.post('/api/auth/send-otp',
            JSON.stringify({ email }),
            {
                headers: { 'Content-Type': 'application/json' },
                withCredentials: true,
            }
        );

        if (!response.data.success) {
            throw new Error(response.data.message);
        }

        toast.success('OTP sent successfully!');

        setDisable(true);
        setTimer(60); // Reset the timer
    } catch (err) {
      // if the new error appears in the toast, it will replace the previous error
      
      toast.error('Failed to send OTP');
    }
    finally {
      setLoading(false);  // Set loading state to false
    }
  };

    useEffect(() => {
        if (disable && timer > 0) {
            const interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
            
            return () => clearInterval(interval);
        }
    }, [disable, timer]);

    useEffect(() => {
        if (timer === 0) {
            setDisable(false);
        }
    }, [timer]);

    const verifyOTP = async () => {
        const otp = OTPinput.join('');

        try {
            const response = await axios.post('/api/auth/verify-otp', 
                JSON.stringify({ email, otp }),
                {
                    headers: { 'Content-Type': 'application/json' },
                    withCredentials: true,
                }
            );

            console.log(response.data.message);
            
            if (!response.data.success) {
                throw new Error(response.data.message);
            }
          
            

            toast.success('OTP verified successfully!');

            if (location.state.type === 'register') {
                navigate('/auth/login');
            } else if (location.state.type === 'forget-password') {
                navigate('/auth/reset-password', { state: { email } });
          }
            else {
                navigate('/');
          }
          
        } catch (err) {
          
            toast.error('Failed to verify OTP');
        }
    };

    return (
        <div className="flex justify-center items-center w-screen h-screen bg-gray-50">
          <div className="bg-white px-6 pt-10 pb-9 shadow-xl mx-auto w-full max-w-lg rounded-2xl">
            <div className="mx-auto flex w-full max-w-md flex-col space-y-16">
              <div className="flex flex-col items-center justify-center text-center space-y-2">
                <div className="font-semibold text-3xl">
                  <p>Email Verification</p>
                </div>
                <div className="flex flex-row text-sm font-medium text-gray-400">
                  <p>We have sent a code to your email {email}</p>
                </div>
              </div>

              <div>
                <form onSubmit={(e) => { e.preventDefault(); verifyOTP(); }}>
                  <div className="flex flex-col space-y-16">
                    <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <div key={index} className="w-12 h-12">
                          <input
                            maxLength={1}
                            className="w-full h-full flex flex-col items-center justify-center text-center px-2 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                            type="text"
                            value={OTPinput[index]}
                            onChange={(e) => {
                              const newOTPinput = [...OTPinput];
                              newOTPinput[index] = e.target.value;
                              setOTPinput(newOTPinput);
                            }}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col space-y-5">
                      <div>
                        <button
                          className="flex flex-row cursor-pointer items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                          type="submit"
                        >
                          Verify Account
                        </button>
                      </div>

                      <div className="flex flex-row items-center justify-center text-center text-sm font-medium space-x-1 text-gray-500">
                        <p>Didn't receive code?</p>{" "}
                        <button
                          className="flex flex-row items-center"
                          style={{
                            color: disable ? "gray" : "blue",
                            cursor: disable ? "not-allowed" : "pointer",
                            textDecoration: disable ? "none" : "underline",
                          }}
                          onClick={sendOTP}
                          disabled={disable}
                          type="button"
                        >
                          {disable ? `Resend OTP in ${timer}s` : "Resend OTP"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
    );
};

export default EmailVerification;
