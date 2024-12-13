const User = require('../../../models/User');
const bcrypt = require('bcrypt');


const resetPassword = async (req, res) => {
    const { email, newPassword } = req.body;
    
    if (!email || !newPassword) {
        return res.status(400).json({ message: 'Email and new password are required' });
    }

    try {
        // Check if the user exists
        const user = await User.findOne({ where: { email } });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update the user's password
        user.password = hashedPassword;
        await user.save();
        
        return res.status(200).json({ message: 'Password reset successfully' });
        
    } catch (error) {
        return res.status(500).json({ message: 'Failed to reset password. Please try again later' });
    }
};

module.exports = { resetPassword };