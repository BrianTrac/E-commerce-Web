const { sendResetPasswordEmail } = require('../../../services/mailer.service');
const User = require('../../../models/User');

const sendResetLink = async (req, res) => {
    const { email } = req.body;
    
    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    // Check if the user exists
    const user = await User.findOne({ where: { email } });
    if (!user) {
        return res.status(404).json({ message: 'User not found' });
    }

    // Send the password reset link to the user's email
    try {
        sendResetPasswordEmail(email);
        res.status(200).json({ message: 'Password reset link sent successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Failed to send password reset link. Please try again later' });
    }
    
};

module.exports = { sendResetLink };