const User = require('../models/User');
const { generateAccessToken, generateRefreshToken } = require('../Utils/generateTokens');
const REFRESH_TOKEN_SECRET='supersecretrefreshkey'

exports.register = async (req, res) => {
    const { email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const user = await User.create({ email, password });

    if (user) {
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken; // Store refresh token
        await user.save();

        res.status(201).json({
            _id: user._id,
            email: user.email,
            accessToken,
            refreshToken,
        });
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
};
exports.login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);
        user.refreshToken = refreshToken; // Update refresh token
        await user.save();

        res.json({
            _id: user._id,
            email: user.email,
            accessToken,
            refreshToken,
        });
    } else {
        res.status(401).json({ message: 'Invalid email or password' });
    }
};

exports.logout = async (req, res) => {
    const user = await User.findById(req.user._id);
    if (user) {
        user.refreshToken = null;
        await user.save();
        res.json({ message: 'Logged out successfully' });
    } else {
        res.status(404).json({ message: 'User not found' });
    }
};

exports.refreshToken = async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) return res.status(401).json({ message: 'No refresh token provided' });

    const user = await User.findOne({ refreshToken });
    if (!user) return res.status(403).json({ message: 'Invalid refresh token' });

    jwt.verify(refreshToken, REFRESH_TOKEN_SECRET, (err, decoded) => {
        if (err || user._id.toString() !== decoded.id) {
            return res.status(403).json({ message: 'Forbidden' });
        }

        const accessToken = generateAccessToken(user._id);
        res.json({ accessToken });
    });
};