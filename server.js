const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();
const authMiddleware = require('./middlewares/authMiddleware');

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = process.env.PORT || 5000;

// 1. Logger first
app.use((req, res, next) => {
  console.log(`[DEBUG] ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// 2. CORS
app.use(cors()); // Use default for now, it's the most permissive

app.use(express.json());

// Routes - Public
app.use('/auth', require('./routes/authRoutes'));
app.use('/articles', require('./routes/articleRoutes'));
app.use('/shops', require('./routes/shopRoutes'));
app.use('/offers', require('./routes/offerRoutes'));
app.use('/products', require('./routes/productRoutes'));

// Routes - Protected
app.use('/admin', authMiddleware, require('./routes/adminRoutes'));
app.use('/users', authMiddleware, require('./routes/userRoutes'));
app.use('/reviews', require('./routes/reviewRoutes')); // Reviews handled by their own logic or public for reading

// Socket.io connection
io.on('connection', (socket) => {
  console.log('Un client est connecte au socket');
  socket.on('disconnect', () => {
    console.log('Client deconnecte');
  });
});

// Watch MongoDB Collections
const watchCollections = () => {
  const collections = ['shops', 'events', 'users', 'categories', 'offers', 'reviews', 'products'];

  collections.forEach(colName => {
    try {
      const collection = mongoose.connection.collection(colName);
      const changeStream = collection.watch();

      changeStream.on('change', (change) => {
        console.log(`[REALTIME] Change detected in ${colName}:`, change.operationType);
        io.emit('dataChanged', {
          collection: colName,
          operation: change.operationType,
          data: change.fullDocument
        });
      });

      console.log(`Watching collection: ${colName}`);
    } catch (err) {
      console.error(`Error watching collection ${colName}:`, err.message);
    }
  });
};

const startServer = async () => {
  if (!process.env.MONGO_URI) {
    console.error('MONGO_URI est manquant dans le fichier .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connecte');

    // Start watching after connection
    watchCollections();

    server.listen(PORT, () => console.log(`Serveur demarre sur le port ${PORT}`));
  } catch (err) {
    console.error('Echec connexion MongoDB:', err.message);
    process.exit(1);
  }
};

startServer();
