/**
 * Middleware to authorize requests based on user roles.
 * @param {...string} allowedRoles - Roles allowed to access the route.
 * @returns {function} - The middleware function.
 */
const roleMiddleware = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ error: 'User is not authenticated.' });
        }

        const { role } = req.user;

        if (!allowedRoles.includes(role)) {
            return res.status(403).json({ error: 'Access denied. Insufficient permissions.' });
        }

        next();
    };
};

module.exports = roleMiddleware;
