// const express = require('express');
// const router = express.Router();
// const authMiddleware = require('../middleware/authMiddleware');
// const roleMiddleware = require('../middleware/roleMiddleware');
// const taxpayersController = require('../controllers/taxpayersController'); // Vérifiez le chemin et le nom du fichier

// // Ajouter un contribuable
// router.post('/', authMiddleware, roleMiddleware('collector'), taxpayersController.addTaxpayer);

// // Récupérer les contribuables
// router.get('/', authMiddleware, roleMiddleware('collector'), taxpayersController.getTaxpayersByCollector);

// // Modifier un contribuable
// router.put('/:id', authMiddleware, roleMiddleware('collector'), taxpayersController.updateTaxpayer);

// // Supprimer un contribuable
// router.delete('/:id', authMiddleware, roleMiddleware('collector'), taxpayersController.deleteTaxpayer);


// // Associer des taxes à un contribuable
// router.put('/:id/associate-taxes', authMiddleware, roleMiddleware('collector'), taxpayersController.associateTaxes);


// module.exports = router;


















const express = require('express');
const router = express.Router();
const { createTaxpayer, getTaxpayers, getTaxpayersWithTaxes, associateTaxesToTaxpayer, getTaxpayerByPhone } = require('../controllers/taxpayerController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Route pour créer un contribuable (accessible uniquement aux collecteurs)
router.post('/', authMiddleware, roleMiddleware('collector'), createTaxpayer);

// Route pour récupérer tous les contribuables (accessible aux collecteurs et administrateurs)
router.get('/', authMiddleware, roleMiddleware('collector'), getTaxpayers);


// Route pour récupérer les contribuables avec leurs taxes
router.get('/taxpayers-with-taxes', authMiddleware, roleMiddleware('collector'), getTaxpayersWithTaxes);



// // Route pour associer une taxe à un contribuable (accessible au collecteur uniquement)
// router.post('/associate-tax', authMiddleware, roleMiddleware('collector'), associateTaxToTaxpayer);


// Route pour associer des taxes à un contribuable (accessible uniquement aux collecteurs)
router.put('/:taxpayerId/associate-taxes', authMiddleware, roleMiddleware('collector'), associateTaxesToTaxpayer);




module.exports = router;
