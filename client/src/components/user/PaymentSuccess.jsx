import { useSearchParams } from "react-router-dom";
import { HomeIcon } from "lucide-react";
import { useEffect } from "react";
import { updateOrder } from "../../redux/services/user/orderService";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");
    const orderId = searchParams.get("orderId");
    const axiosPrivate = useAxiosPrivate();

    useEffect(() => {
        debugger;
        if (orderId) {
            
            updateOrderId();
        }

        if (!sessionId) {
            return;
        }
    }, []);

    const updateOrderId = async () => {
        await updateOrder(axiosPrivate, orderId, "processing", null);
    };



    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-white bg-green-600 p-4 rounded-lg shadow-lg">Payment Success</h1>
            <p className="mt-4 text-xl text-gray-700">
                Thank you for your purchase
                <span role="img" aria-label="smile">😊</span>
            </p>
            <button 
                className="mt-6 px-6 py-3 bg-blue-500 text-white text-lg font-semibold rounded-lg shadow-md hover:bg-blue-600 transition duration-300"
                onClick={() => window.location.href = "/"}
            >
                <HomeIcon className="inline-block mr-2" />
                Back to Home
            </button>
        </div>
    );
};

export default PaymentSuccess;