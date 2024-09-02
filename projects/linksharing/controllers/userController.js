const User = require('../models/userSchema');
const bcrypt = require('bcrypt');

exports.register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already taken' });
        }

        const user = new User({
            firstName,
            lastName,
            email,
            password: hashedPassword
        });

        const savedUser = await user.save();

        res.status(201).json({ message: 'Successfully registered user', user: savedUser });
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
};