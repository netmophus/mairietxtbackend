const express = require('express');
const router = express.Router();
const { changePassword, resetPassword , getUserProfile} = require('../controllers/passwordController');
const authMiddleware = require('../middleware/authMiddleware');
const roleMiddleware = require('../middleware/roleMiddleware');

// Route pour que l'utilisateur change son mot de passe
router.put('/me/password', authMiddleware, changePassword);


// Route pour récupérer le profil de l'utilisateur connecté
router.get('/me', authMiddleware, getUserProfile);

// Route pour réinitialiser le mot de passe d'un utilisateur (admin uniquement)
router.put('/:id/reset-password', authMiddleware, roleMiddleware('admin'), resetPassword);

module.exports = router;
