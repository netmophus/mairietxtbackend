// const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken');
// const User = require('../models/User'); // Importer le modèle utilisateur
// const Collector = require ('../models/Collector')
// // Contrôleur pour l'inscription



// const registerUser = async (req, res) => {
//   const { name, phone, email, password, role, status } = req.body; // Inclure le statut dans la requête

//   try {
//     // Vérifier si le numéro de téléphone existe déjà
//     const existingUser = await User.findOne({ phone });
//     if (existingUser) {
//       return res.status(400).json({ message: 'Numéro de téléphone déjà utilisé' });
//     }

//     // Hacher le mot de passe
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Créer un nouvel utilisateur avec le statut
//     const newUser = new User({
//       name,
//       phone,
//       email,
//       password: hashedPassword,
//       role,
//       status: status || 'active', // Par défaut, le statut est "active" si non spécifié
//     });

//     await newUser.save();
//     res.status(201).json({ message: 'Utilisateur créé avec succès', user: newUser });
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur lors de l’inscription', error: err.message });
//   }
// };

// // Contrôleur pour la connexion
// const loginUser = async (req, res) => {
//   const { phone, password } = req.body;

//   try {
//     // Vérifier si l’utilisateur existe
//     const user = await User.findOne({ phone });
//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     // Vérifier le mot de passe
//     const isPasswordValid = await bcrypt.compare(password, user.password);
//     if (!isPasswordValid) {
//       return res.status(401).json({ message: 'Mot de passe incorrect' });
//     }

//  // Générer un token JWT
// const token = jwt.sign(
//   { id: user._id, role: user.role, phone: user.phone }, // Ajout du champ phone
//   'secretKey', // Remplacez par une clé secrète sécurisée
//   { expiresIn: '1d' }
// );


//     res.status(200).json({
//       token,
//       user: { id: user._id, name: user.name, phone: user.phone, role: user.role },
//     });
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur lors de la connexion' });
//   }
// };


// // Contrôleur pour récupérer la liste des utilisateurs
// const getUsers = async (req, res) => {
//   try {
//     const users = await User.find({}, '-password'); // Exclut le champ "password"
//     res.status(200).json(users);
//   } catch (err) {
//     res.status(500).json({
//       message: 'Erreur lors de la récupération des utilisateurs',
//       error: err.message,
//     });
//   }
// };




// // const updateUserStatus = async (req, res) => {
// //   const { id } = req.params;
// //   const { status } = req.body;

// //   try {
// //     const user = await User.findById(id);
// //     if (!user) {
// //       return res.status(404).json({ message: 'Utilisateur non trouvé' });
// //     }

// //     user.status = status;
// //     await user.save();

// //     res.status(200).json({ message: 'Statut mis à jour avec succès', user });
// //   } catch (err) {
// //     res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: err.message });
// //   }
// // };

// const updateUserStatus = async (req, res) => {
//   const { id } = req.params; // ID de l'utilisateur
//   const { status } = req.body; // Nouveau statut

//   try {
//     // Mettre à jour le statut de l'utilisateur
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     user.status = status;
//     await user.save();

//     // Mettre à jour le statut du collecteur associé
//     const collector = await Collector.findOne({ phone: user.phone }); // Associer via le téléphone
//     if (collector) {
//       collector.status = status; // Synchroniser le statut
//       await collector.save();
//     }

//     res.status(200).json({ message: 'Statut mis à jour avec succès', user, collector });
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: err.message });
//   }
// };




// const deleteUser = async (req, res) => {
//   const { id } = req.params;

//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     await user.remove();
//     res.status(200).json({ message: 'Utilisateur supprimé avec succès' });
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur lors de la suppression', error: err.message });
//   }
// };


// const updateUser = async (req, res) => {
//   const { id } = req.params;
//   const { name, phone, email, role, status } = req.body;

//   try {
//     const user = await User.findById(id);
//     if (!user) {
//       return res.status(404).json({ message: 'Utilisateur non trouvé' });
//     }

//     // Mettre à jour les champs fournis
//     if (name) user.name = name;
//     if (phone) user.phone = phone;
//     if (email) user.email = email;
//     if (role) user.role = role;
//     if (status) user.status = status;

//     await user.save();

//     res.status(200).json({ message: 'Utilisateur mis à jour avec succès', user });
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur lors de la mise à jour', error: err.message });
//   }
// };




// module.exports = { registerUser, loginUser,  getUsers, updateUserStatus, deleteUser, updateUser };



















const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Assurez-vous que le chemin correspond à votre modèle

// Fonction d'inscription
const registerUser = async (req, res) => {
  try {
    const { name, phone, email, password, role } = req.body;

    // Vérification si le numéro de téléphone est déjà utilisé
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ message: 'Numéro de téléphone déjà utilisé.' });
    }

    // Hacher le mot de passe
    const hashedPassword = await bcrypt.hash(password, 10);

    // Création d'un nouvel utilisateur
    const newUser = new User({
      name,
      phone,
      email,
      password: hashedPassword,
      role: role || 'taxpayer', // Par défaut, rôle contribuable
    });

    await newUser.save();

    res.status(201).json({
      message: 'Utilisateur enregistré avec succès.',
      user: {
        id: newUser._id,
        name: newUser.name,
        phone: newUser.phone,
        role: newUser.role,
      },
    });
  } catch (err) {
    res.status(500).json({
      message: 'Erreur lors de l\'inscription.',
      error: err.message,
    });
  }
};

// Fonction de connexion
// const loginUser = async (req, res) => {
//   try {
//     const { phone, password } = req.body;

//     // Vérification si l'utilisateur existe
//     const user = await User.findOne({ phone });
//     if (!user) {
//       return res.status(400).json({ message: 'Utilisateur non trouvé.' });
//     }

//     // Vérification du mot de passe
//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: 'Mot de passe incorrect.' });
//     }

//     // Génération du token JWT
//     const token = jwt.sign(
//       { id: user._id, role: user.role, phone: user.phone },
//       process.env.JWT_SECRET || 'secretKey', // Utiliser une clé secrète dans .env
//       { expiresIn: '7d' }
//     );

//     res.status(200).json({
//       message: 'Connexion réussie.',
//       token,
//       user: {
//         id: user._id,
//         name: user.name,
//         phone: user.phone,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     res.status(500).json({
//       message: 'Erreur lors de la connexion.',
//       error: err.message,
//     });
//   }
// };



const loginUser = async (req, res) => {
  try {
    console.log('Début du processus de connexion...');
    const { phone, password } = req.body;

    console.log('Données reçues :', { phone, password: '********' }); // Ne loguez jamais le mot de passe en clair

    // Vérification si l'utilisateur existe
    console.log('Recherche de l\'utilisateur avec le téléphone :', phone);
    const user = await User.findOne({ phone });
    if (!user) {
      console.error('Utilisateur non trouvé avec ce téléphone :', phone);
      return res.status(400).json({ message: 'Utilisateur non trouvé.' });
    }

    console.log('Utilisateur trouvé :', {
      id: user._id,
      name: user.name,
      phone: user.phone,
      role: user.role,
    });

    // Vérification du mot de passe
    console.log('Vérification du mot de passe...');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.error('Mot de passe incorrect pour l\'utilisateur :', phone);
      return res.status(400).json({ message: 'Mot de passe incorrect.' });
    }

    console.log('Mot de passe vérifié avec succès.');

    // Génération du token JWT
    console.log('Génération du token JWT...');
    const token = jwt.sign(
      { id: user._id, role: user.role, phone: user.phone },
      process.env.JWT_SECRET || 'secretKey', // Utiliser une clé secrète dans .env
      { expiresIn: '7d' }
    );

    console.log('Token généré avec succès :', token);

    res.status(200).json({
      message: 'Connexion réussie.',
      token,
      user: {
        id: user._id,
        name: user.name,
        phone: user.phone,
        role: user.role,
      },
    });
    console.log('Connexion réussie pour l\'utilisateur :', user.name);
  } catch (err) {
    console.error('Erreur lors du processus de connexion :', err.message);
    res.status(500).json({
      message: 'Erreur lors de la connexion.',
      error: err.message,
    });
  }
};


module.exports = { registerUser, loginUser };
