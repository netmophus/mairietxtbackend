// const express = require('express');
// const mongoose = require('mongoose');
// const cors = require('cors');
// const dotenv = require('dotenv');
// const userRoutes = require('./routes/userRoutes'); // Import des routes utilisateurs
// const taxRoutes = require('./routes/taxRoutes');
// const zoneRoutes = require('./routes/zoneRoutes'); // Importer les routes des zones
// const collectorRoutes = require('./routes/collectorRoutes'); // Importer les routes des collecteurs
// const taxpayersRoutes = require('./routes/taxpayersRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
// const adminDashboardRoutes = require('./routes/adminDashboardRoutes');
// const collectorDashboardRoutes = require('./routes/collectorDashboardRoutes');
// const taxpayersDashboardRoutes = require('./routes/taxpayersDashboardRoutes');



// // const taxpayerPaymentRoutes = require('./routes/taxpayerPaymentRoutes'); // Route pour la gestion des paiements des contribuables
// // const taxpayerTaxRoutes = require('./routes/taxpayerTaxRoutes'); // Route pour la gestion des taxes des contribuables


// // Charger les variables d'environnement
// dotenv.config();

// // Initialiser l'application
// const app = express();

// // Middleware
// app.use(cors());
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));

// // Importer les routes
// const authRoutes = require('./routes/authRoutes'); // Routes d'authentification

// // Routes principales
// app.get('/', (req, res) => {
//   res.send('MairieTaxe Backend is running!');
// });



// app.use('/api/auth', authRoutes); // Préfixe pour les routes d'authentification

// // Routes
// app.use('/api/users', userRoutes); // Ajouter les routes utilisateur

// app.use('/api/taxes', taxRoutes); // Gestion des taxes

// app.use('/api/zones', zoneRoutes); // Utiliser les routes pour les zones

// app.use('/api/collectors', collectorRoutes); // Utiliser les routes pour les collecteurs

// app.use('/api/taxpayers', taxpayersRoutes);

// app.use('/api/payments', paymentRoutes); // Ajouter les routes pour les paiements

// // Routes pour le tableau de bord de l'administrateur
// app.use('/api/admin-dashboard', adminDashboardRoutes);

// // Utiliser les routes
// app.use('/api/collector-dashboard', collectorDashboardRoutes);


// app.use('/api/taxpayers-dashboard', taxpayersDashboardRoutes);
// // app.use('/api/taxpayers-dashboard', (req, res, next) => {
// //   console.log(`Requête reçue sur la route ${req.originalUrl}`);
// //   next();
// // }, taxpayersDashboardRoutes);

// // Configuration des routes
// // app.use('/api/taxpayer-payments', taxpayerPaymentRoutes); // Routes pour la gestion des paiements
// // app.use('/api/taxpayer-taxes', taxpayerTaxRoutes); // Routes pour la gestion des taxes




// // Connecter à MongoDB
// mongoose
//   .connect('mongodb://127.0.0.1:27017/mairie-taxe') // Utilisation de 127.0.0.1 au lieu de localhost
//   .then(() => console.log('MongoDB connected successfully'))
//   .catch((err) => console.error('MongoDB connection error:', err));

//   // Démarrer le serveur
// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server running on port ${PORT}`);
// });




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

// Middleware global
app.use(cors()); // Autoriser les requêtes cross-origin
app.use(express.json()); // Parser les données JSON

// Connexion à MongoDB
// Connecter à MongoDB
mongoose
  .connect('mongodb://127.0.0.1:27017/mairie-taxe') // Utilisation de 127.0.0.1 au lieu de localhost
  .then(() => console.log('MongoDB connected successfully'))
  .catch((err) => console.error('MongoDB connection error:', err));


  console.log("✅ AT_USERNAME:", process.env.AT_USERNAME);
  console.log("✅ AT_API_KEY:", process.env.AT_API_KEY ? "Clé détectée" : "Clé absente !");
  

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

// Gestion des erreurs
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ message: 'Une erreur est survenue.', error: err.message });
// });


app.use((req, res, next) => {
  console.log(`📥 ${req.method} ${req.url}`);
  next();
});

// Démarrer le serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur en cours d'exécution sur http://localhost:${PORT}`);
});
