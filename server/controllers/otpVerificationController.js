const OTP = require('../model/OTP');
const moment = require('moment');

const verifyOTP = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    
    if (!email || !otp) {
        return res.status(400).json({ message: 'Email and OTP are required' });
    }

    try {
        // Find the OTP entry associated with the email
        const otpEntry = await OTP.findOne({ where: { email } });
        console.log(otpEntry);
    
        if (!otpEntry) {
            console.log('OTP not found for this email');
            return res.status(400).json({ message: 'OTP not found for this email' });
        }
        
        // Check if OTP has expired
        if (moment().isAfter(otpEntry.expiresAt)) {
            console.log('OTP has expired');
            return res.status(400).json({ message: 'OTP has expired. Please request a new OTP' });
        }

        // Check if the OTP matches
        if (otpEntry.otp.trim() !== otp.trim()) {
            console.log(otpEntry.otp);
            console.log(otp);
            console.log('Invalid OTP');
            return res.status(400).json({ message: 'Invalid OTP' });
        }

        // OTP is valid
        res.status(200).json({ message: 'OTP verified successfully' });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: 'Failed to verify OTP. Please try again later' });
    }
};

module.exports = { verifyOTP } ;