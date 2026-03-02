const adminMiddleware = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: 'Unauthorized: No user found in request' });
    }

    if (req.user.profile !== 'ADMIN') {
        return res.status(403).json({ message: 'Forbidden: Admin access required' });
    }

    next();
};

module.exports = adminMiddleware;
