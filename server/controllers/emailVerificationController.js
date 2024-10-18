const { sendOTPVerificationEmail } = require('../config/mailer');
const User = require('../model/User');
const OTP = require('../model/OTP');
const crypto = require('crypto');

const verifyEmail = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Generate OTP (6-digit number) but save it as a string
    const otp = crypto.randomInt(100000, 999999);

    // Check if an OTP already exists for the user
    const existingOTP = await OTP.findOne({ where: { userId: user.id, email: email } });

    if (existingOTP) {
        // Update the existing OTP
        existingOTP.otp = otp;
        existingOTP.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minute
        await existingOTP.save();
    } else {
        // Create a new OTP entry
        await OTP.create({
            userId: user.id,
            email: email,
            otp: otp,
            expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minute
        });
    }

    // Send the OTP to the user's email
    try {
        await sendOTPVerificationEmail(email, otp);
        res.status(200).json({ message: 'OTP sent successfully. Please check your inbox' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to send OTP. Please try again later' });
    } 
};

module.exports = { verifyEmail };


