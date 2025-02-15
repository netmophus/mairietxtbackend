const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes');
const taxRoutes = require('./routes/taxRoutes');
const zoneRoutes = require('./routes/zoneRoutes');
const collectorRoutes = require('./routes/collectorRoutes');
const taxpayerRoutes = require('./routes/taxpayerRoutes');
const paymentRoutes = require('./routes/paymentRoutes');
const marketRoutes = require('./routes/marketRoutes');
const receiptBatchRoutes = require('./routes/receiptBatchRoutes');
const adminStaticsRoutes = require('./routes/AdminStaticsRoutes');
const notificationRoutes = require("./routes/notificationRoutes");

dotenv.config();
require('iconv-lite').encodingExists('foo');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware global
app.use(cors({
  origin: [
    'https://mairietxtfrontend-faa0da7e21d3.herokuapp.com', // URL du frontend déployé
    'http://localhost:3000', // Pour le développement local
    'http://localhost:3001',
    'http://localhost:3002'
  ],
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json()); // Parser les données JSON

app.options('*', cors());

// Logger toutes les requêtes
app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Connecter à MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connecté à MongoDB Atlas");

    // Démarrer le serveur après la connexion réussie
    app.listen(PORT, () => {
      console.log(`🚀 Serveur en ligne sur le port : ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Erreur MongoDB :", err);
    process.exit(1); // Quitter l'application en cas d'erreur de connexion
  });

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/taxes', taxRoutes);
app.use('/api/zones', zoneRoutes);
app.use('/api/collectors', collectorRoutes);
app.use('/api/taxpayers', taxpayerRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/markets', marketRoutes);
app.use('/api/receipt-batches', receiptBatchRoutes);
app.use('/api/admin', adminStaticsRoutes);
app.use("/api/notifications", notificationRoutes);

// Route de base pour vérifier le fonctionnement de l'API
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur l\'API de gestion des taxes.' });
});