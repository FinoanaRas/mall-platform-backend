/**
 * tests/app.js
 * App Express partagée pour les tests — sans démarrer le serveur listen()
 * Connexion MongoDB gérée dans setup.js (beforeAll / afterAll)
 */

require('dotenv').config();
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');

const app = express();

app.use(express.json());
app.use(authMiddleware);

// Routes
app.use('/auth', require('../routes/authRoutes'));
app.use('/articles', require('../routes/articleRoutes'));
app.use('/shops', require('../routes/shopRoutes'));
app.use('/offers', require('../routes/offerRoutes'));
app.use('/admin', require('../routes/adminRoutes'));

module.exports = app;
