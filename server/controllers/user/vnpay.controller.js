const crypto = require('crypto');
const qs = require('qs');
require('dotenv').config();

const vnpayConfig = {
    vnp_TmnCode: process.env.VNP_TMN_CODE,
    vnp_HashSecret: process.env.VNP_HASH_SECRET,
    vnp_Url: process.env.VNP_URL,
    vnp_ReturnUrl: process.env.VNP_RETURN_URL,
};

function sortObject(obj) {
    const sorted = {};
    const keys = Object.keys(obj).sort();
    
    for (const key of keys) {
        if (obj[key] !== '' && obj[key] !== null && obj[key] !== undefined) {
            sorted[key] = obj[key];
        }
    }
    return sorted;
}

function formatDate(date) {
    const pad = (number) => number < 10 ? `0${number}` : number;
    
    return [
        date.getFullYear(),
        pad(date.getMonth() + 1),
        pad(date.getDate()),
        pad(date.getHours()),
        pad(date.getMinutes()),
        pad(date.getSeconds())
    ].join('');
}

const createPaymentUrl = async (req, res) => {
    try {
        let { orderInfo, amount } = req.body;
        
        // Set timezone to Vietnam
        process.env.TZ = 'Asia/Ho_Chi_Minh';
        const date = new Date();
        
        // Format the date
        const createDate = formatDate(date);
        
        // Generate a unique transaction reference
        const tmnCode = process.env.VNP_TMN_CODE;
        const txnRef = `${createDate}_${Math.round(Math.random() * 100000)}`;
        
        // Clean the order info
        orderInfo = orderInfo || 'Payment';
        
        // Get IP address
        const ipAddr = 
            req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            '127.0.0.1';

        // Ensure amount is a number and convert to VND (multiply by 100 as per VNPAY requirements)
        amount = Math.round(parseFloat(amount)) * 100;
        
        // Create the parameter object with minimal required fields
        const vnpParams = {
            vnp_Version: '2.1.0',
            vnp_Command: 'pay',
            vnp_TmnCode: tmnCode,
            vnp_Amount: amount,
            vnp_CreateDate: createDate,
            vnp_CurrCode: 'VND',
            vnp_IpAddr: ipAddr,
            vnp_Locale: 'vn',
            vnp_OrderInfo: orderInfo,
            vnp_OrderType: '250000', // Fixed value for general payment
            vnp_ReturnUrl: vnpayConfig.vnp_ReturnUrl,
            vnp_TxnRef: txnRef
        };

        // Sort the parameters
        const sortedParams = sortObject(vnpParams);
        
        // Create the signing data
        const signData = qs.stringify(sortedParams, { encode: true });
        const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        
        // Add the secure hash
        const finalParams = {
            ...sortedParams,
            vnp_SecureHash: signed
        };

        // Generate the final URL
        const paymentUrl = `${vnpayConfig.vnp_Url}?${qs.stringify(finalParams, { encode: true })}`;
        
        // Log for debugging
    //    console.log('Sign Data:', signData);
    //    console.log('Hash Secret:', vnpayConfig.vnp_HashSecret);
    //    console.log('Generated Hash:', signed);
    //    console.log('Payment URL:', paymentUrl);
        
        res.json({ success: true, paymentUrl });
    } catch (error) {
        console.error('Error creating payment URL:', error);
        res.status(500).json({ 
            code: '99',
            message: 'Error creating payment URL',
            error: error.message 
        });
    }
};

const handlePaymentReturn = async (req, res) => {
    try {
        let vnpParams = { ...req.query };
        const secureHash = vnpParams['vnp_SecureHash'];
        
        // Remove hash from params
        delete vnpParams['vnp_SecureHash'];
        delete vnpParams['vnp_SecureHashType'];

        // Sort parameters
        vnpParams = sortObject(vnpParams);
        
        // Check signature
        const signData = qs.stringify(vnpParams, { encode: true });
        const hmac = crypto.createHmac('sha512', vnpayConfig.vnp_HashSecret);
        const signed = hmac.update(Buffer.from(signData, 'utf-8')).digest('hex');
        
        if (secureHash === signed) {
            const responseCode = vnpParams['vnp_ResponseCode'];
            if (responseCode === '00') {
                // insert orderId into the query string
                res.redirect(`${process.env.CLIENT_URL}/checkout/success`);
            } else {
                res.redirect(`${process.env.CLIENT_URL}/checkout/failure?code=${responseCode}`);
            }
        } else {
            res.redirect(`${process.env.CLIENT_URL}/checkout/failure?code=97`);
        }
    } catch (error) {
        console.error('Error handling payment return:', error);
        res.redirect(`${process.env.CLIENT_URL}/checkout/failure?code=99`);
    }
};

module.exports = { createPaymentUrl, handlePaymentReturn };