const jwt = require('jsonwebtoken');
const JWT_SECRET = 'supersecretjwtkey';
const REFRESH_TOKEN_SECRET = 'supersecretrefreshkey';

const generateAccessToken = (id) => {
    return jwt.sign({ id }, JWT_SECRET, { expiresIn: '1500m' }); // Short-lived
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, REFRESH_TOKEN_SECRET, { expiresIn: '7d' }); // Longer-lived
};

module.exports = { generateAccessToken, generateRefreshToken };