const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const authRoutes = require('./routes/authRoutes'); // Import des routes d'authentification
const taxRoutes = require('./routes/taxRoutes');
const zoneRoutes = require('./routes/zoneRoutes'); // Import des routes des zones
const collectorRoutes = require('./routes/collectorRoutes');
const taxpayerRoutes = require('./routes/taxpayerRoutes');

const paymentRoutes = require('./routes/paymentRoutes');


const marketRoutes = require('./routes/marketRoutes'); // Import market routes
const receiptBatchRoutes = require('./routes/receiptBatchRoutes');

const adminStaticsRoutes = require('./routes/AdminStaticsRoutes');
const notificationRoutes = require("./routes/notificationRoutes");
require("dotenv").config();




// Charger les variables d'environnement
dotenv.config();
require('iconv-lite').encodingExists('foo'); // Charge l'encodage UTF-8
const app = express();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur en ligne sur le port : ${PORT}`);
});


// Middleware global
const allowedOrigins = [
  "http://localhost:3000",
  "https://marietxtbackend-36943b009f4d.herokuapp.com", // Mets ici l'URL de ton frontend Heroku
];

app.use(cors({
  origin: allowedOrigins,
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));





app.use(express.json()); // Parser les données JSON


// Connecter à MongoDB
mongoose
  // .connect('mongodb://127.0.0.1:27017/mairie-taxe') // Utilisation de 127.0.0.1 au lieu de localhost
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ Connecté à MongoDB Atlas"))
  .catch(err => console.error("❌ Erreur MongoDB :", err));

// Routes
app.use('/api/auth', authRoutes); // Routes pour l'authentification

app.use('/api/taxes', taxRoutes);

app.use('/api/zones', zoneRoutes); // Routes pour les zones


app.use('/api/collectors', collectorRoutes);

// Routes
app.use('/api/taxpayers', taxpayerRoutes); // Route pour les contribuables

app.use('/api/payments', paymentRoutes);





// Routes Market
app.use('/api/markets', marketRoutes);
app.use('/api/receipt-batches', receiptBatchRoutes);



// Déclaration des routes
app.use('/api/admin', adminStaticsRoutes);


// Routes
app.use("/api/notifications", notificationRoutes);



// Route de base pour vérifier le fonctionnement de l'API
app.get('/', (req, res) => {
  res.status(200).json({ message: 'Bienvenue sur l\'API de gestion des taxes.' });
});




app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
