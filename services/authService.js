const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const { User } = require('../models/User');

const AuthService = {
    authenticate: async (email, password) => {
        const user = await User.findOne({email: email});
        if (!user) throw new Error('User not found');

        const valid = await bcrypt.compare(password, user.password);
        if (!valid) throw new Error('Invalid password');

        const secret_key = process.env.SECRET_KEY;
     
        let token = jwt.sign({ id: user.id, email: user.email, name: user.name, profile: user.profile },
            secret_key, {expiresIn: '3h',
        });

        return token;
    },

    verifyToken: (token) => {
        return jwt.verify(token, process.env.SECRET_KEY);
    }
};

module.exports = AuthService;