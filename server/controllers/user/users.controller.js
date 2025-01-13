const User = require('../../models/User');

const getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll();
        if (!users.length) {
            return res.status(404).json({ message: 'No users found' });
        }
        return res.json(users);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const deleteUser = async (req, res) => {
    if (!req.body.id) {
        return res.status(400).json({ message: 'Bad request' });
    }

    try {
        const user = await User.findByPk(req.body.id);
        if (!user) {
            return res.status(404).json({ message: `User ${req.body.id} not found` });
        }

        await user.destroy();
        return res.status(204).json({ message: 'No content' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUserById = async (req, res) => {
    if (!req.params.id) {
        return res.status(400).json({ message: 'Bad request' });
    }

    try {
        const user = await User.findByPk(req.params.id);
        if (!user) {
            return res.status(404).json({ message: `User ${req.params.id} not found` });
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUserByEmail = async (req, res) => {
    if (!req.params.email) {
        return res.status(400).json({ message: 'Bad request' });
    }

    try {
        const
            user = await User.findOne({ where: { email: req.params.email } });
        if (!user) {
            return res.status(404).json({ message: `User ${req.params.email} not found` });
        }

        return res.json(user);
    }
    catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

const getUserInfo = async (req, res) => {
    try {
        const user = await User.findByPk(req.user.id);
        if (!user) {
            return res.status(404).json({ message: `User ${req.user.id} not found` });
        }

        return res.json(user);
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getAllUsers,
    deleteUser,
    getUserById,
    getUserByEmail,
    getUserInfo,
};

