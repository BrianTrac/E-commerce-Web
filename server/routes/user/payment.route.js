const router = require("express").Router();
const { createPaymentSession } = require("../../controllers/user/stripe.controller");
const { createPaymentUrl, handlePaymentReturn } = require("../../controllers/user/vnpay.controller");

const { createOrder, captureOrder } = require("../../controllers/user/paypal.controller");

router.post("/stripe/create-checkout-session", createPaymentSession);
router.post("/vnpay/create-payment-url", createPaymentUrl);
router.get("/vnpay/payment-return", handlePaymentReturn);
router.post("/paypal/create-order", createOrder);
router.post("/paypal/capture-order", captureOrder);

module.exports = router;