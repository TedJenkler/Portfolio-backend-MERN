const User = require('../models/userSchema');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const logger = require('../config/logger');
require('dotenv').config();

exports.register = async (req, res, next) => {
    const { firstName, lastName, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.info(`Registration attempt failed for email: ${email} - Email already taken`);
            return res.status(409).json({ message: 'Email already taken' });
        }

        const user = new User({
            firstName,
            lastName,
            email,
            password
        });

        const savedUser = await user.save();

        logger.info(`User registered successfully with email: ${email}`);
        res.status(201).json({ message: 'Successfully registered user', user: savedUser });
    } catch (error) {
        logger.error('Error during registration', { error: error.message });
        res.status(500).json({ message: 'Internal Server Error' });
    }
};

exports.login = async (req, res, next) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.info(`Login attempt failed for email: ${email} - User not found`);
            return res.status(404).json({ error: 'User not found' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.info(`Login attempt failed for email: ${email} - Invalid credentials`);
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        logger.info(`Login successful for email: ${email}`);
        res.json({ token });
    } catch (error) {
        logger.error('Error during login', { error: error.message });
        res.status(500).json({ message: 'Internal Server Error' });
    }
};