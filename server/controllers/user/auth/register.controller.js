const User = require('../../../models/User');
const TempUser = require('../../../models/TempUser');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');
const { generateOTP, verifyOTP } = require('../../../utils/otpService');
const { sendOTPVerificationEmail } = require('../../../services/mailer.service');

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

        const hashedPassword = await bcrypt.hash(password, 10);
        // Check if a temporary user with the same email already exists
        const existingTempUser = await TempUser.findOne({ where: { email: email } });
        if (existingTempUser) {
            // Delete the existing temporary user
            await TempUser.destroy({ where: { email: email } });
        }

        // Temporarily store the user's data in the TempUser table
        await TempUser.create({
            username: username,
            email: email,
            password: hashedPassword,
            otp: otp,
        });

        return res.status(200).json({ message: 'OTP sent successfully. Please check your inbox' });
    } catch (err) {
        console.log(err);
        return res.status(500).json({message: err.message});
    }
};

const verifyRegistrationOTP = async(req, res) => {
    const { email, otp } = req.body;  
//    console.log(email, otp);
    if (!email || !otp) {
        return res.status(400).json({ message: 'incorrect form submission' });
    }

    const {success, message} = await verifyOTP(email, otp, 'registration');
    if (!success) {
        console.log(message);
        return res.status(400).json({ message });
    }

    try {
        const tempUser = await TempUser.findOne({ where: { email: email } });
        if (!tempUser) {
            return res.status(404).json({ message: 'Error with registration please register again !!!' });
        }

        const newUser = await User.create({
            username: tempUser.username,
            email: tempUser.email,
            password: tempUser.password,
            role: 'User',
            is_active: true,
        });

        await newUser.save();
        await TempUser.destroy({ where: { email: email } });
       
        res.status(200).json({success: true, message: 'User registered successfully'});
    } catch (err) {
        return res.status(500).json({ message: err.message });
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

