const User = require('../models/User');
const jwt = require('jsonwebtoken');

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc  Register user
// @route POST /api/auth/register
const register = async (req, res, next) => {
    try {
        let { name, email, password, role, location } = req.body;

        // default role to 'consumer' if not provided
        role = role ? String(role).toLowerCase() : 'consumer';

        // disallow registering as admin via public register endpoint
        if (role === 'admin') {
            return res.status(403).json({ message: 'Admin accounts must be created by an administrator' });
        }

        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: 'Email already registered' });

        // consumers are auto-approved; farmers require admin approval
        const isApproved = role === 'consumer';

        const user = await User.create({ name, email, password, role, location, isApproved });

        res.status(201).json({
            message: role === 'consumer' ? 'Registration successful' : 'Registration successful! Waiting for admin approval.',
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                location: user.location,
            },
        });
    } catch (err) {
        next(err);
    }
};

// @desc  Login user
// @route POST /api/auth/login
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const isMatch = await user.matchPassword(password);
        if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

        if (!user.isApproved) {
            return res.status(403).json({ message: 'Waiting for admin approval' });
        }

        res.json({
            token: generateToken(user._id),
            user: {
                _id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                isApproved: user.isApproved,
                location: user.location,
                avatar: user.avatar,
            },
        });
    } catch (err) {
        next(err);
    }
};

// @desc  Get my profile
// @route GET /api/auth/me
const getMe = async (req, res) => {
    res.json(req.user);
};

module.exports = { register, login, getMe };
