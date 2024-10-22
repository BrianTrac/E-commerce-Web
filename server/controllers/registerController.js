const User = require('../models/User');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const { generateOTP, verifyOTP } = require('../helper/otpService');
const { sendOTPVerificationEmail } = require('../config/mailer');

const handleRegister = async (req, res) => {
    const { username, email, password } = req.body;
    
    if (!username || !email || !password) {
        return res.status(400).json({message: 'incorrect form submission'});
    }

    // check if username already exists
    const existingUserName = await User.findOne({
        where: {
            username: username
        }
    });

    if (existingUserName) {
        return res.status(409).json({ message: 'Username already exists' });
    }

    //check if email already exists
    const existingEmail = await User.findOne({
        where: {
            email: email
        }
    });

    if (existingEmail) {
        return res.status(409).json({ message: 'Email already exists' });
    }

    try {
        // Generate OTP for registration purpose
        const otp = await generateOTP(null, email, 'registration');

        // Send OTP to the user's email
        sendOTPVerificationEmail(email, otp);
        console.log('OTP sent successfully');

        return res.status(200).json({ message: 'OTP sent successfully. Please check your inbox' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: err.message});
    }
};

const verifyRegistrationOTP = async(req, res) => {
    const { email, otp, username, password } = req.body;    
    if (!email || !otp || !username || !password) {
        return res.status(400).json({ message: 'incorrect form submission' });
    }

    const {success, message} = await verifyOTP(email, otp, 'registration');
    if (!success) {
        console.log(message);
        return res.status(400).json({ message });
    }

    try {
        // Hash the password and crate the user
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            role: 'User'
        });

        await newUser.save();
       
        res.status(200).json({success: true, message: 'User registered successfully'});
    } catch (err) {
        return res.status(500).json({ message: 'Failed to register user. Please try again later' });
    }
};

const resendOTP = async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const otp = await generateOTP(null, email, 'registration');
        await sendOTPVerificationEmail(email, otp);

        res.status(200).json({ success: true, message: 'OTP sent successfully' });
    } catch (err) {
        return res.status(500).json({ message: 'Failed to send OTP. Please try again later' });
    }
}

module.exports = {
    handleRegister,
    verifyRegistrationOTP,
    resendOTP,
};

