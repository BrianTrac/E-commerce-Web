import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(`pk_test_51Q5ronRr3bKcvTz2XvxuD1ynBZ8Qc3DRDb5QTTUtUcUJrq5acMvtspS00AqKyIxdeaoZLPd1ZdhdoPOrTzHRysZe00QXTmhpBe`); // Replace with your Stripe publishable key

const handleCheckout = async (axiosPrivate, cartItems, totalPrice, orderId) => {
    const stripe = await stripePromise; // Load the Stripe.js instance

    // Construct the success URL
    const successUrl = `${window.location.origin}/checkout/success?orderId=${orderId}&`;
    const cancelUrl = `${window.location.origin}/checkout/failure`;

    const response = await axiosPrivate.post("/api/payment/stripe/create-checkout-session", {
        cartItems,
        totalPrice,
        successUrl,
        cancelUrl,
    });

    const sessionId = response.data.sessionId;

    await stripe.redirectToCheckout({ sessionId });
};



const createPaymentUrl = async (axiosPrivate, orderInfo, amount, orderId) => {
    try {
        const response = await axiosPrivate.post("/api/payment/vnpay/create-payment-url", {
            orderInfo: "Payment",
            amount,
        });

        if (!response.data.success) {
            alert("Failed to create payment URL");
            return;
        }

        const paymentUrl = response.data.paymentUrl;
        window.open(`${paymentUrl}`, "_blank");
    } catch (error) {
        console.error(error);
        alert("Failed to create payment URL");
    }
};

const handlePaymentReturn = async (axiosPrivate, queryParams) => {
    try {
        const response = await axiosPrivate.get("/api/payment/vnpay/payment-return", {
            params: queryParams,
        });

        if (!response.data.success) {
            alert("Failed to handle payment return");
            window.location.href = "/checkout/failure";
            return;
        }

        alert("Payment successful");
        window.location.href = "/checkout/success";

    } catch (error) {
        console.error(error);
        alert("Failed to handle payment return");
    }
};

export { handleCheckout, createPaymentUrl, handlePaymentReturn };
