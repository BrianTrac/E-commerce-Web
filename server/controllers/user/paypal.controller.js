const { client } = require('../../config/paypal.config');
const paypal = require('@paypal/checkout-server-sdk');

const createOrder = async (req, res) => {
    const { cartItems, totalPrice } = req.body;

    try {
        // Ensure cartItems and totalPrice are valid
        if (!cartItems || !totalPrice) {
            return res.status(400).json({ message: "Invalid cart items or total price" });
        }

        // Calculate the item total in USD (or another supported currency)
        const itemTotalUSD = cartItems.reduce((sum, item) => {
            const price = parseFloat(item.product.price); // Convert price to number
            const quantity = parseInt(item.quantity, 10); // Convert quantity to integer
            if (isNaN(price) || isNaN(quantity)) {
                throw new Error("Invalid item price or quantity");
            }
            return sum + price * quantity;
        }, 0);

        // Convert totalPrice to USD if needed
        const totalPriceUSD = parseFloat(totalPrice);

        if (isNaN(totalPriceUSD)) {
            return res.status(400).json({ message: "Invalid total price" });
        }

        const request = new paypal.orders.OrdersCreateRequest();
        request.prefer("return=representation");
        request.requestBody({
            intent: 'CAPTURE',
            purchase_units: [
                {
                    amount: {
                        currency_code: 'USD', // Use USD or another supported currency
                        value: itemTotalUSD.toFixed(2),
                        breakdown: {
                            item_total: {
                                currency_code: 'USD',
                                value: itemTotalUSD.toFixed(2),
                            },
                        },
                    },
                    items: cartItems.map((item) => {
                        const price = parseFloat(item.product.price);
                        const quantity = parseInt(item.quantity, 10);
                        return {
                            name: item.product.name,
                            unit_amount: {
                                currency_code: 'USD',
                                value: price.toFixed(2),
                            },
                            quantity: quantity.toString(),
                        };
                    }),
                },
            ],
        });

        const order = await client().execute(request);
        res.status(200).json({ orderId: order.result.id });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error creating Paypal order",
            error: error.message || "Internal Server Error",
        });
    }
};
  
const captureOrder = async (req, res) => {
    const { orderId } = req.body;
    try {
        const request = new paypal.orders.OrdersCaptureRequest(orderId);
        request.requestBody({});

        const capture = await client().execute(request);
        res.status(200).json({ status: capture.result.status });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error capturing Paypal order" });
    }
};

module.exports = { createOrder, captureOrder };