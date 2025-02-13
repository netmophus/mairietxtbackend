const Payment = require('../models/Payment');
const Collector = require('../models/Collector');
const Taxpayer = require('../models/Taxpayer'); 



// Obtenir le total des taxes collectées
const getTaxesCollected = async (req, res) => {
  console.log('===== Début du contrôleur getTaxesCollected =====');
  try {
    const totalTaxesCollected = await Payment.aggregate([
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);

    const total = totalTaxesCollected[0]?.total || 0;
    console.log('Total des taxes collectées :', total);

    res.status(200).json({ totalTaxesCollected: total });
  } catch (err) {
    console.error('Erreur lors de la récupération des taxes collectées :', err.message);
    res.status(500).json({ message: 'Erreur lors de la récupération des taxes collectées.' });
  }
};

// Obtenir le nombre de collecteurs actifs
const getActiveCollectors = async (req, res) => {
  console.log('===== Début du contrôleur getActiveCollectors =====');
  try {
    const activeCollectors = await Collector.countDocuments({ status: 'active' });
    
    console.log('Nombre de collecteurs actifs :', activeCollectors);

    res.status(200).json({ activeCollectors });
  } catch (err) {
    console.error('Erreur lors de la récupération des collecteurs actifs :', err.message);
    res.status(500).json({ message: 'Erreur lors de la récupération des collecteurs actifs.' });
  }
};


// Récupérer la liste des collecteurs actifs
const getActiveCollectorsDetails = async (req, res) => {
    console.log('===== Début du contrôleur getActiveCollectorsDetails =====');
    try {
      const activeCollectors = await Collector.find({ status: 'active' }).select('name phone address hireDate');
      console.log('Collecteurs actifs trouvés :', activeCollectors);
  
      res.status(200).json(activeCollectors);
    } catch (err) {
      console.error('Erreur lors de la récupération des collecteurs actifs :', err.message);
      res.status(500).json({ message: 'Erreur lors de la récupération des collecteurs actifs.' });
    }
  };



//   const getPaymentsSummary = async (req, res) => {
//     console.log('===== Début du contrôleur getPaymentsSummary =====');
//     try {
//       // Regrouper les paiements par collecteur et zone
//       const payments = await Payment.aggregate([
//         {
//           $lookup: {
//             from: 'users', // Collection des utilisateurs
//             localField: 'collector',
//             foreignField: '_id',
//             as: 'collectorDetails',
//           },
//         },
//         {
//           $lookup: {
//             from: 'zones', // Collection des zones
//             localField: 'collectorDetails.assignedZones',
//             foreignField: '_id',
//             as: 'zoneDetails',
//           },
//         },
//         {
//           $project: {
//             collectorName: { $arrayElemAt: ['$collectorDetails.name', 0] },
//             zoneName: { $arrayElemAt: ['$zoneDetails.name', 0] },
//             amount: 1,
//             paymentDate: 1,
//           },
//         },
//         {
//           $group: {
//             _id: { collector: '$collectorName', zone: '$zoneName' },
//             totalAmount: { $sum: '$amount' },
//             payments: { $push: { amount: '$amount', paymentDate: '$paymentDate' } },
//           },
//         },
//       ]);
  
//       console.log('Résumé des paiements :', payments);
  
//       res.status(200).json(payments);
//     } catch (err) {
//       console.error('Erreur lors de la récupération du résumé des paiements :', err.message);
//       res.status(500).json({ message: 'Erreur lors de la récupération du résumé des paiements.' });
//     }
//   };


const getPaymentsSummary = async (req, res) => {
    console.log('===== Début du contrôleur getPaymentsSummary =====');
    try {
      const payments = await Payment.aggregate([
        {
          $lookup: {
            from: 'taxpayers', // Collection des contribuables
            localField: 'taxpayer',
            foreignField: '_id',
            as: 'taxpayerDetails',
          },
        },
        {
          $unwind: '$taxpayerDetails',
        },
        {
          $lookup: {
            from: 'zones', // Collection des zones
            localField: 'taxpayerDetails.zone',
            foreignField: '_id',
            as: 'zoneDetails',
          },
        },
        {
          $unwind: { path: '$zoneDetails', preserveNullAndEmptyArrays: true },
        },
        {
          $lookup: {
            from: 'users', // Collection des collecteurs
            localField: 'collector',
            foreignField: '_id',
            as: 'collectorDetails',
          },
        },
        {
          $unwind: { path: '$collectorDetails', preserveNullAndEmptyArrays: true },
        },
        {
          $group: {
            _id: {
              collector: '$collectorDetails.name',
              zone: '$zoneDetails.name',
            },
            totalAmount: { $sum: '$amount' },
            payments: { $push: { paymentDate: '$paymentDate', amount: '$amount' } },
          },
        },
      ]);
  
      console.log('Résumé des paiements généré :', payments);
      res.status(200).json(payments);
    } catch (err) {
      console.error('Erreur lors de la génération du résumé des paiements :', err.message);
      res.status(500).json({ message: 'Erreur lors de la génération du résumé des paiements.' });
    }
  };




  const getContributorsByCollector = async (req, res) => {
    console.log('===== Début du contrôleur getContributorsByCollector =====');
    try {
      const taxpayers = await Taxpayer.aggregate([
        {
          $lookup: {
            from: 'users', // Liaison avec la collection des collecteurs
            localField: 'assignedCollector',
            foreignField: '_id',
            as: 'collectorDetails',
          },
        },
        {
          $unwind: { path: '$collectorDetails', preserveNullAndEmptyArrays: true },
        },
        {
          $group: {
            _id: '$collectorDetails.name',
            taxpayers: { $push: { name: '$name', phone: '$phone', address: '$address', zone: '$zone' } },
          },
        },
      ]);
  
      console.log('Contribuables par collecteur :', JSON.stringify(taxpayers, null, 2));
      res.status(200).json(taxpayers);
    } catch (err) {
      console.error('Erreur lors de la récupération des contribuables par collecteur :', err.message);
      res.status(500).json({ message: 'Erreur lors de la récupération des contribuables.' });
    }
  };
  


module.exports = {
  getTaxesCollected,
  getActiveCollectors,
  getPaymentsSummary,
  getContributorsByCollector,
};
