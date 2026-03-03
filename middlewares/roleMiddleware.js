const roleMiddleware = (allowedRoles = []) => {
    return (req, res, next) => {
        const user = req.user;
        if (!user || !user.profile) {
            return res.status(403).json({ message: "Refused access. No profile" });
        }

        if (!allowedRoles.includes(user.profile)) {
            return res.status(403).json({ message: "Refused access. Not permitted" });
        }

        next();
    };
};

module.exports = roleMiddleware;