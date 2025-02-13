const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');
const adminDashboardController = require('../controllers/adminDashboardController'); // Nouveau contrôleur

// Route pour récupérer les statistiques des taxes collectées
router.get('/taxes-collected', authMiddleware, roleMiddleware('admin'), adminDashboardController.getTaxesCollected);

// Route pour récupérer les collecteurs actifs
router.get('/active-collectors', authMiddleware, roleMiddleware('admin'), adminDashboardController.getActiveCollectors);


// Route pour récupérer les paiements par collecteurs et zones
router.get(
  '/payments-summary',
  authMiddleware,
  roleMiddleware('admin'),
  adminDashboardController.getPaymentsSummary
);


// Récupérer les contribuables par collecteur
router.get(
    '/contributors-by-collector',
    authMiddleware,
    roleMiddleware('admin'),
    adminDashboardController.getContributorsByCollector
  );


module.exports = router;
