const User = require('../model/User');
const bcrypt = require('bcrypt');
const Sequelize = require('sequelize');

const handleRegister = async (req, res) => {
    const { username, email, password } = req.body;
//    console.log(req.body);
    if (!username || !email || !password) {
        return res.status(400).json('incorrect form submission');
    }

    //check if user already exists
    const existingUser = await User.findOne({
        where: {
            [Sequelize.Op.or]: [
                { username: username },
                { email: email }
            ]
        }
    });


    if (existingUser) {
        return res.status(409).json('username already exists');
    }

    try {
        //hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            username: username,
            email: email,
            password: hashedPassword,
            role: 'User'
        });

        await newUser.save();
        res.status(201).json({'success': 'user created'});

    } catch (err) {
        return res.status(500).json({'error': err.message});
    }
};

module.exports = { handleRegister };

