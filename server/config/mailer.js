const nodemailer = require('nodemailer');
const Mailgen = require('mailgen');
const { WEB_URL } = require('./config');;

// Link to verify email
LINK_TO_VERIFY_EMAIL = `${WEB_URL}/auth/verify-email`;

// Create a transporter for sending emails
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

// Mailgen configuration
const mailGenerator = new Mailgen({
    theme: 'default',
    product: {
        name: 'E-commerce',
        link: WEB_URL,
    },
});

// Function to send OTP to the user's email
const sendOTPVerificationEmail = async (email, otp) => {
    const emailTemplate = {
        body: {
            name: email,
            intro: 'Welcome to E-commerce! Your OTP is:',
            action: {
                instructions: 'Please use the following OTP to verify your email:',
                button: {
                    color: '#22BC66',
                    text: `Your OTP: ${otp}`,
                    link: LINK_TO_VERIFY_EMAIL,
                },
            },
            outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.',
        },
    };

    const emailBody = mailGenerator.generate(emailTemplate);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'OTP Verification',
        html: emailBody,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Verification email sent to ${email} successfully`);
    } catch (err) {
        console.error(err);
    }
};

// Function to send reset password link to the user's email
const sendResetPasswordEmail = async (email) => {
    const emailTemplate = {
        body: {
            name: email,
            intro: 'You have received this email because a password reset request was received for your account.',
            action: {
                instructions: 'Click the button below to reset your password:',
                button: {
                    color: '#DC4D2F',
                    text: 'Reset Password',
                    link: `${WEB_URL}/auth/reset-password?email=${email}`,
                },
            },
            outro: 'If you did not request a password reset, no further action is required on your part.',
        },
    };

    const emailBody = mailGenerator.generate(emailTemplate);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to: email,
        subject: 'Password Reset',
        html: emailBody,
    };

    try {
        // Send the email
        await transporter.sendMail(mailOptions);
        console.log(`Password reset email sent to ${email} successfully`);
    } catch (err) {
        console.error(err);
    }
};

module.exports = { sendOTPVerificationEmail, sendResetPasswordEmail };

