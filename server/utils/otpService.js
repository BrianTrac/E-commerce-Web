const OTP = require('../models/OTP');
const crypto = require('crypto');
const moment = require('moment');

const generateOTP = async (userId, email, purpose) => { 
    // Generate OTP (6-digit number) but save it as a string
    const otp = crypto.randomInt(100000, 999999).toString();
    console.log(userId, email, purpose);

    // Check if an OTP already exists for the user
    try {
        const existingOTP = await OTP.findOne({ where: { email, purpose } });
    
        if (existingOTP) {
            // Update the existing OTP
            existingOTP.otp = otp;
            existingOTP.expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minute
            await existingOTP.save();
        }
        else {
            const expiresAt = new Date(Date.now() + 10 * 60 * 1000);
            console.log(expiresAt);

            await OTP.create({
                userId,
                email,
                purpose,
                otp,
                expiresAt: expiresAt, // 10 minutes
            });
        }
    } catch (error) {
        console.error(error);
        throw new Error('Failed to generate OTP');
    }

    return otp;
}

const verifyOTP = async (email, otp, purpose) => {
    // Find the OTP entry associated with the email and purpose
    const otpEntry = await OTP.findOne({ where: { email, purpose } });

    if (!otpEntry) {
        return { success: false, message: 'OTP not found for this email' };
    }

    // Check if OTP matches
    if (otpEntry.otp.trim() !== otp.trim()) {
        return { success: false, message: 'Invalid OTP' };
    }

    // Check if OTP has expired
    if (moment().isAfter(otpEntry.expiresAt)) {
        return { success: false, message: 'OTP has expired. Please request a new OTP' };
    }

    // OTP is valid
    return { success: true, message: 'OTP verified successfully' };
};


module.exports = {
    generateOTP,
    verifyOTP,
};
