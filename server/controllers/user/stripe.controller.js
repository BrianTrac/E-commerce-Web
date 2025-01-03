const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createPaymentSession = async (req, res) => {
    const { cartItems, totalPrice, successUrl, cancelUrl } = req.body;
//    console.log('req.body: ', req.body);
    try {
        const lineItems = cartItems.map((item) => ({
            price_data: {
                currency: "vnd",
                product_data: {
                    name: item.product.name,
                    images: [item.product.image],
                },
                unit_amount: parseInt(item.product.price, 10),
            },
            quantity: item.quantity,
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items: lineItems,
            mode: "payment",
            success_url: `${successUrl}?session_id={CHECKOUT_SESSION_ID}`,
            cancel_url: cancelUrl,
            metadata: {
                totalPrice: totalPrice.toString(),
            },
        })

        res.status(200).json({ sessionId: session.id });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error" });
    }
};

module.exports = { createPaymentSession };