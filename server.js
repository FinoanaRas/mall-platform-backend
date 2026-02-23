const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(authMiddleware);

// Connexion à MongoDB
mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connecté"))
.catch(err => console.log(err));

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/articles', require('./routes/articleRoutes'));
app.use('/shops', require('./routes/shopRoutes'));
app.use('/offers', require('./routes/offerRoutes'));

app.listen(PORT, () => console.log(`Serveur démarré sur le port ${PORT}`));