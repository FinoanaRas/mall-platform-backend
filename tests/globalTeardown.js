/**
 * tests/globalTeardown.js
 * S'exécute UNE FOIS après tous les fichiers de tests
 * Déconnexion propre de MongoDB
 */
const mongoose = require('mongoose');

module.exports = async () => {
    await mongoose.disconnect();
};
