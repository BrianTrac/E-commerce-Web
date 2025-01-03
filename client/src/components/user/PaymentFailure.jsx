import { useSearchParams } from "react-router-dom";
import { HomeIcon } from "lucide-react";
import { useEffect } from "react";

const PaymentFailure = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("session_id");

    useEffect(() => {
        if (!sessionId) {
            return;
        }
    }, [sessionId]);

    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
            <h1 className="text-4xl font-bold text-white bg-red-600 p-4 rounded-lg shadow-lg">Payment Failure</h1>
            <p className="mt-4 text-xl text-gray-700">
                Unfortunately, your payment could not be processed
                <span role="img" aria-label="sad">😞</span>
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

export default PaymentFailure;