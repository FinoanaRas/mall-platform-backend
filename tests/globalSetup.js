/**
 * tests/globalSetup.js
 * S'exécute UNE FOIS avant tous les fichiers de tests
 * Connexion MongoDB Atlas persistante
 */
const mongoose = require('mongoose');
require('dotenv').config();

module.exports = async () => {
    await mongoose.connect(process.env.MONGO_URI);
    // On stocke la connexion dans global pour pouvoir la fermer dans globalTeardown
    global.__MONGOOSE__ = mongoose;
};
