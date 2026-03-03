const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { User } = require('../models/User');

const AuthService = {
    authenticate: async (email, password) => {
        console.log(`Tentative de connexion pour : ${email}`);
        const user = await User.findOne({ email: email });
        if (!user) {
            console.log(`Utilisateur non trouvé : ${email}`);
            throw new Error('User not found');
        }

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) {
            console.log(`Mot de passe incorrect pour : ${email}`);
            throw new Error('Invalid password');
        }

        const secret_key = process.env.SECRET_KEY;
        console.log(`Authentification réussie pour : ${email}. Génération du token...`);

        let token = jwt.sign(
            { id: user.id, email: user.email, name: user.name, profile: user.profile },
            secret_key,
            { expiresIn: '7d' }
        );

        return token;
    },

    verifyToken: (token) => {
        return jwt.verify(token, process.env.SECRET_KEY);
    },

    requestPasswordReset: async (email) => {
        const user = await User.findOne({ email });
        if (!user) {
            // Avoid revealing if user exists or not for security
            return;
        }

        const resetToken = jwt.sign(
            { id: user.id, purpose: 'password_reset' },
            process.env.SECRET_KEY,
            { expiresIn: '1h' }
        );

        // Simulation: In production, send this via email
        console.log(`[AUTH] Password reset requested for ${email}`);
        console.log(`[AUTH] Reset Token: ${resetToken}`);
    },

    resetPassword: async (token, newPassword) => {
        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.purpose !== 'password_reset') {
            throw new Error('Invalid reset token');
        }

        const user = await User.findById(decoded.id);
        if (!user) {
            throw new Error('User not found');
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(newPassword, salt);
        await user.save();

        console.log(`[AUTH] Password successfully reset for user ${user.email}`);
    }
};

module.exports = AuthService;