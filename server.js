const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const PORT = process.env.PORT || 5000;

// 1. Logger first
app.use((req, res, next) => {
  console.log(`[DEBUG] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 2. CORS
app.use(cors()); // Use default for now, it's the most permissive

app.use(express.json());
app.use(authMiddleware);

// Routes
app.use('/auth', require('./routes/authRoutes'));
app.use('/products', require('./routes/productRoutes'));
app.use('/shops', require('./routes/shopRoutes'));
app.use('/offers', require('./routes/offerRoutes'));
app.use('/admin', require('./routes/adminRoutes'));
app.use('/review', require('./routes/reviewRoutes'));
app.use('/reduction', require('./routes/reductionRoutes'));
app.use('/favorite', require('./routes/favoriteRoutes'));

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI est manquant dans le fichier .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecte');
    app.listen(PORT, () => console.log(`Serveur demarre sur le port ${PORT}`));
  } catch (err) {
    console.error('Echec connexion MongoDB:', err.message);
    process.exit(1);
  }
};

/*const mongoose = require('mongoose');
const uri = "";

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } };

async function run() {
  try {
    // Create a Mongoose client with a MongoClientOptions object to set the Stable API version
    await mongoose.connect(uri, clientOptions);
    await mongoose.connection.db.admin().command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await mongoose.disconnect();
  }
}
*/

startServer();
