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

exports.update = async (req, res, next) => {
    const { firstName, lastName, currentEmail, email } = req.body;

    try {
        if (email && email !== currentEmail) {
            const checkEmail = await User.findOne({ email: email });
            if (checkEmail) {
                return res.status(400).json({ message: 'Email already exists' });
            }
        }

        const user = await User.findOne({ email: currentEmail });
        if (!user) {
            return res.status(404).json({ message: 'Cannot find user' });
        }

        const updateFields = {
            firstName: firstName,
            lastName: lastName
        };
        if (email) {
            updateFields.email = email;
        }

        const updateResult = await User.updateOne(
            { _id: user._id },
            { $set: updateFields }
        );
        if (updateResult.modifiedCount === 0) {
            return res.status(400).json({ message: 'User update failed' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    } catch (error) {
        console.error('Cannot update user', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}