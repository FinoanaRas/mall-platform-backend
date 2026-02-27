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

        let token = jwt.sign({ id: user.id, email: user.email, name: user.name, profile: user.profile },
            secret_key, {
                expiresIn: '3h',
        });

        return token;
    },

    verifyToken: (token) => {
        return jwt.verify(token, process.env.SECRET_KEY);
    }
};

module.exports = AuthService;