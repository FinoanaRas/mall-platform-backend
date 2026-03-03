const AuthService = require('../services/authService');

// Authenticate request token
const authMiddleware = (req, res, next) => {
    if (req.method === 'OPTIONS')
        return next();

    const authHeader = req.headers['authorization'];
    if (!authHeader) { return res.status(401).json({ message: 'No token provided' }); }

    const token = authHeader.split(' ')[1];
    try {
        const user = AuthService.verifyToken(token);
        req.user = user;
        next();
    } catch (err) {
        console.log("Token invalide détécté");
        return res.status(401).json({ message: 'Invalid token' });
    }
};

module.exports = authMiddleware;