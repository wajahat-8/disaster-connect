// D:/disaster-connect/disaster-connect-backend/controllers/authController.js

const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

const generateToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: '90d'
    });
};

// User Registration Function
exports.register = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // 1. Validate input
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ message: 'Please provide all required fields.' });
        }

        // 2. Check if user already exists [cite: 462]
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'Email is already registered.' });
        }

        // 3. Create and save new user
        const newUser = await User.create({ name, email, phone, password });
        
        // 4. Generate token and send response
        const token = generateToken(newUser._id);
        res.status(201).json({
            status: 'success',
            token,
            data: { id: newUser._id, name: newUser.name, email: newUser.email },
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error during registration.', error: error.message });
    }
};

// User Login Function
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Check if email and password exist
        if (!email || !password) {
            return res.status(400).json({ message: 'Please provide email and password.' });
        }

        // 2. Find user and include password for comparison
        const user = await User.findOne({ email }).select('+password');
        
        // 3. Check if user exists and password is correct [cite: 464]
        if (!user || !(await user.correctPassword(password, user.password))) {
            return res.status(401).json({ message: 'Incorrect email or password.' });
        }

        // 4. If everything is okay, send token to client
        const token = generateToken(user._id);
        res.status(200).json({
            status: 'success',
            token,
            data: { id: user._id, name: user.name, email: user.email },
        });

    } catch (error) {
        res.status(500).json({ message: 'Server error during login.', error: error.message });
    }
};