const jwt = require('jsonwebtoken');

/**
 * Middleware to authenticate requests using a JWT token.
 * @param {object} req - The request object.
 * @param {object} res - The response object.
 * @param {function} next - The next middleware function.
 */
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers['authorization'];

    if (!authHeader) {
        return res.status(401).json({ error: 'Access denied. No token provided.' });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Invalid token format.' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Attach the decoded token to the request object
        next();
    } catch (error) {
        console.error('Token verification error:', error.message);
        return res.status(401).json({ error: 'Session expired. Please log in again.' });
    }
};

module.exports = authMiddleware;
