import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link} from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { selectAuth, clearError, clearSuccess } from '../../redux/reducers/user/authReducer';
import { resendOTP, verifyOTP } from '../../redux/actions/user/authAction';

const RESEND_TIMER = 30; 

const OTPVerification = () => {
  const [OTPinput, setOTPinput] = useState(['', '', '', '', '', '']);
  const otpInputs = useRef([]);
  const navigate = useNavigate();
  const [disable, setDisable] = useState(true);
  const [timer, setTimer] = useState(RESEND_TIMER);
  const [loadingResend, setLoadingResend] = useState(false); // Add loading state
  const [validInputOTP, setValidInputOTP] = useState(false);
  const dispatch = useDispatch();
  const [isVerified, setIsVerified] = useState(false);
  const { user, error, loading, success } = useSelector(selectAuth);
  const type = new URLSearchParams(location.search).get('type') || 'user';
  
  const [email, setEmail] = useState(null);
  // get email from query params if not already set
  useEffect(() => {
    if (!email) {
      const params = new URLSearchParams(window.location.search);
      const emailParam = params.get('email');
      if (emailParam) {
        setEmail(emailParam);
      }
    }
  }, [email]);

  useEffect(() => {
    dispatch(clearError());
    dispatch(clearSuccess());
  }, [dispatch]);
 
  // check if the user enter all the input OTP
  useEffect(() => {
    if (OTPinput.every((otp) => otp !== '')) {
      setValidInputOTP(true);
    } else {
      setValidInputOTP(false);
    }
  }, [OTPinput]);

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

  useEffect(() => {
    if (success) {
      toast.success(success);
      if (isVerified) {
        navigate('/auth/login?type=' + type);
      }
      dispatch(clearSuccess());
    }

    if (error) {
      toast.error(error);
      dispatch(clearError());
    }
  }, [success, navigate, dispatch, error]);
  

  const submitResendOTP = async () => {
    if (loadingResend) return;  // Prevent function if already loading
    setDisable(true);
    setTimer(RESEND_TIMER);
    setLoadingResend(true);  // Set loading state to true
    try {
      setIsVerified(false);
      await dispatch(resendOTP({ email}));
    }
    finally {
      setDisable(true);
      setTimer(RESEND_TIMER); // Reset the timer
      setLoadingResend(false);  // Set loading state to false
    }
  };

    
  const submitVerifyOTP = async () => {
    const otp = OTPinput.join('');
 
    setIsVerified(true);
    await dispatch(verifyOTP({ email, otp }));
    
  };

  
  
  const handleOTPInputsChange = (e, index) => {
    const newOTPinput = [...OTPinput];
    newOTPinput[index] = e.target.value;
    setOTPinput(newOTPinput);

    // Focus next input
    if (e.target.value && index < otpInputs.current.length - 1) {
      otpInputs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key == 'ArrowLeft' && index > 0) {
      otpInputs.current[index - 1].focus();
    } else if (e.key == 'ArrowRight' && index < otpInputs.current.length - 1) {
      otpInputs.current[index + 1].focus();
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
                  {
                  email ?
                    <p>We have sent a code to your email {email}</p>
                    : <div className="mt-6 text-center text-sm">
                    <span className="text-gray-600">Back to </span>
                    <Link to="/auth/register" className="font-medium text-blue-500 hover:text-blue-700 hover:underline">
                     Register
                    </Link>
                </div>
                  }
                </div>
              </div>

              <div>
                <form onSubmit={(e) => { e.preventDefault(); submitVerifyOTP(); }}>
                  <div className="flex flex-col space-y-16">
                    <div className="flex flex-row items-center justify-between mx-auto w-full max-w-xs">
                      {[0, 1, 2, 3, 4, 5].map((index) => (
                        <div key={index} className="w-12 h-12">
                          <input
                            maxLength={1}
                            ref={(el) => (otpInputs.current[index] = el)}
                            className="w-full h-full flex flex-col items-center justify-center text-center px-2 outline-none rounded-xl border border-gray-200 text-lg bg-white focus:bg-gray-50 focus:ring-1 ring-blue-700"
                            type="text"
                            value={OTPinput[index]}
                            onChange={(e) => handleOTPInputsChange(e, index)}
                            onKeyDown={(e) => handleKeyDown(e, index)}
                          />
                        </div>
                      ))}
                    </div>

                    <div className="flex flex-col space-y-5">
                      <div>
                        <button
                          className="flex flex-row cursor-pointer items-center justify-center text-center w-full border rounded-xl outline-none py-5 bg-blue-700 border-none text-white text-sm shadow-sm"
                          type="submit"
                          style={{
                            backgroundColor: !validInputOTP ? "gray" : "blue",
                            cursor: !validInputOTP || loading ? "not-allowed" : "pointer",
                          }}
                          disabled={!validInputOTP}
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
                          onClick={submitResendOTP}
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

export default OTPVerification;
