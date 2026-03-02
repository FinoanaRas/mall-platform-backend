/**
 * tests/setup.js
 * setupFiles = s'exécute dans chaque worker Jest avant les tests
 * On se connecte à MongoDB Atlas, sans afterAll — --forceExit ferme tout proprement
 */
require('dotenv').config();
const mongoose = require('mongoose');

// Connexion une seule fois par worker (runInBand = un seul worker)
beforeAll(async () => {
    if (mongoose.connection.readyState === 0) {
        await mongoose.connect(process.env.MONGO_URI);
    }
});
