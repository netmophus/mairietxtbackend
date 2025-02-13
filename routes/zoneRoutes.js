// const express = require('express');
// const router = express.Router();
// const zoneController = require('../controllers/zoneController');
// const authMiddleware = require('../middleware/authMiddleware');
// const roleMiddleware = require('../middleware/roleMiddleware');

// // Ajouter une zone
// router.post('/', authMiddleware, roleMiddleware('admin'), zoneController.addZone);

// // Récupérer toutes les zones
// router.get('/', authMiddleware, zoneController.getAllZones);

// // Modifier une zone
// router.put('/:id', authMiddleware, roleMiddleware('admin'), zoneController.updateZone);

// // Supprimer une zone
// router.delete('/:id', authMiddleware, roleMiddleware('admin'), zoneController.deleteZone);


// router.get('/zones', authMiddleware, roleMiddleware('collector'), zoneController.getZones);

// module.exports = router;






const express = require('express');
const router = express.Router();
const { createZone, getAllZones } = require('../controllers/zoneController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Route pour créer une zone (accessible uniquement aux administrateurs)
router.post('/', authMiddleware, roleMiddleware('admin'), createZone);

// Route pour récupérer toutes les zones
router.get('/', authMiddleware, getAllZones);

module.exports = router;
