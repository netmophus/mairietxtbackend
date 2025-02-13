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
const PORT = process.env.PORT || Math.floor(10000 + Math.random() * 50000);

// app.listen(PORT, () => {
//   console.log(`🚀 Serveur en ligne sur le port : ${PORT}`);
// });


// Middleware global
const allowedOrigins = [
  "http://localhost:3000",
 "https://marietxtfrontend-9799da37a83c.herokuapp.com/", // URL du frontend, 
];

app.use(cors({
  origin: allowedOrigins,
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
}));





app.use(express.json()); // Parser les données JSON


// Connecter à MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ Connecté à MongoDB Atlas");
    app.listen(PORT, () => {
      console.log(`🚀 Serveur en ligne sur le port : ${PORT}`);
    });
  })
  .catch(err => {
    console.error("❌ Erreur MongoDB :", err);
    process.exit(1); // Quitter l'application en cas d'erreur de connexion
  });


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
