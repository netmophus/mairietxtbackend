// const Zone = require('../models/zone');

// // Ajouter une zone
// const addZone = async (req, res) => {
//     try {
//       const { name, description } = req.body;
//       const newZone = new Zone({ name, description });
//       await newZone.save();
//       res.status(201).json({ message: 'Zone créée avec succès.', zone: newZone });
//     } catch (err) {
//       res.status(500).json({ message: 'Erreur lors de la création de la zone.', error: err.message });
//     }
//   };
  
// // Récupérer toutes les zones
// // Récupérer toutes les zones
// const getAllZones = async (req, res) => {
//     try {
//       const zones = await Zone.find(); // Récupère toutes les zones
//       res.status(200).json(zones);
//     } catch (err) {
//       res.status(500).json({ message: 'Erreur lors de la récupération des zones.', error: err.message });
//     }
//   };
  
  

// // Modifier une zone
// const updateZone = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const updatedZone = await Zone.findByIdAndUpdate(id, req.body, { new: true });
//     if (!updatedZone) {
//       return res.status(404).json({ message: 'Zone non trouvée.' });
//     }
//     res.status(200).json({ message: 'Zone modifiée avec succès.', zone: updatedZone });
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur lors de la modification de la zone.', error: err.message });
//   }
// };

// // Supprimer une zone
// const deleteZone = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const deletedZone = await Zone.findByIdAndDelete(id);
//     if (!deletedZone) {
//       return res.status(404).json({ message: 'Zone non trouvée.' });
//     }
//     res.status(200).json({ message: 'Zone supprimée avec succès.' });
//   } catch (err) {
//     res.status(500).json({ message: 'Erreur lors de la suppression de la zone.', error: err.message });
//   }
// };


// const getZones = async (req, res) => {
//     try {
//         // Récupérer l'utilisateur connecté
//         const collector = await Collector.findOne({ user: req.user.id });

//         if (!collector) {
//             return res.status(403).json({ message: "Vous n'êtes pas autorisé à voir ces zones." });
//         }

//         // Filtrer les zones associées au collecteur connecté
//         const zones = await Zone.find({ assignedCollectors: collector._id });

//         res.status(200).json(zones);
//     } catch (err) {
//         console.error('Erreur lors de la récupération des zones :', err.message);
//         res.status(500).json({ message: 'Erreur lors de la récupération des zones.' });
//     }
// };

  

// module.exports = { addZone, getAllZones, updateZone, deleteZone, getZones };


























const Zone = require('../models/Zone');

// Création d'une nouvelle zone
const createZone = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Vérification des champs obligatoires
    if (!name) {
      return res.status(400).json({ message: 'Le nom de la zone est obligatoire.' });
    }

    // Vérifier si une zone avec le même nom existe déjà
    const existingZone = await Zone.findOne({ name });
    if (existingZone) {
      return res.status(400).json({ message: 'Une zone avec ce nom existe déjà.' });
    }

    // Créer une nouvelle zone
    const newZone = new Zone({ name, description });
    await newZone.save();

    res.status(201).json({ message: 'Zone créée avec succès.', zone: newZone });
  } catch (err) {
    console.error('Erreur lors de la création de la zone :', err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

// Récupération de toutes les zones
const getAllZones = async (req, res) => {
  try {
    const zones = await Zone.find();
    res.status(200).json(zones);
  } catch (err) {
    console.error('Erreur lors de la récupération des zones :', err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};

module.exports = {
  createZone,
  getAllZones,
};
