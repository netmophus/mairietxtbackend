

const TaxpayerTax = require('../models/TaxpayerTax');
const Taxpayer = require('../models/Taxpayer');
const ReceiptBatch = require('../models/ReceiptBatch'); // Assurez-vous du chemin correct vers le modèle

const Tax = require('../models/Tax');
const Payment = require('../models/Payment');

const MarketTaxPayment = require('../models/MarketTaxPayment'); // Assurez-vous que le chemin est correct

const logger = require("../utils/logger"); // Import du logger
const sendSmsNotification = require("../utils/sendSmsNotification");











const addMarketTaxPayment = async (req, res) => {
  try {
    console.log("📥 Données reçues pour le paiement :", req.body);

    const { receiptId, confirmationCode, amountPaid } = req.body;

    // Validation des données requises
    if (!receiptId || !confirmationCode || !amountPaid) {
      console.error("❌ Données manquantes :", { receiptId, confirmationCode, amountPaid });
      return res.status(400).json({ message: 'Tous les champs sont requis.' });
    }

    console.log("🔍 Recherche du lot activé contenant le reçu...");
    // Rechercher le lot activé contenant le reçu
    const receiptBatch = await ReceiptBatch.findOne({
      status: 'Activated', // Statut activé
      "confirmationCodes.receipt": receiptId, // Reçu spécifique
    });

    if (!receiptBatch) {
      console.error("❌ Lot activé introuvable pour le reçu :", receiptId);
      return res.status(404).json({ message: 'Reçu introuvable dans ce lot.' });
    }

    console.log("✅ Lot activé trouvé :", JSON.stringify(receiptBatch, null, 2));

    // Trouver le sous-document correspondant dans `confirmationCodes`
    const receipt = receiptBatch.confirmationCodes.find((code) => code.receipt === receiptId);

    if (!receipt) {
      console.error("❌ Reçu introuvable dans le lot :", receiptId);
      return res.status(404).json({ message: 'Reçu introuvable dans ce lot.' });
    }

    console.log("✅ Reçu trouvé :", receipt);

    // Vérification du statut du reçu
    if (receipt.status !== 'Activated') {
      console.warn("⚠️ Reçu non activé ou déjà utilisé :", receiptId);
      return res.status(400).json({ message: 'Reçu non activé ou déjà utilisé.' });
    }

    // Validation du code de confirmation
    if (confirmationCode !== receipt.code) {
      console.error("❌ Code de confirmation incorrect :", confirmationCode);
      return res.status(400).json({ message: 'Code de confirmation incorrect.' });
    }

    // Validation du montant payé
    if (amountPaid <= 0) {
      console.error("❌ Montant invalide :", amountPaid);
      return res.status(400).json({ message: 'Montant invalide.' });
    }

    console.log("💾 Enregistrement du paiement...");
    // Enregistrer le paiement
    const marketTaxPayment = new MarketTaxPayment({
      receipt: receiptId, // Numéro du reçu utilisé
      confirmationCode, // Code validé
      amount: amountPaid,
      collector: receiptBatch.collector, // ID du collecteur depuis le batch
      market: receiptBatch.market, // ID du marché associé
      paymentDate: new Date(),
    });

    await marketTaxPayment.save(); // Sauvegarde dans la base de données
    console.log("✅ Paiement enregistré :", marketTaxPayment);

    // Mettre à jour le statut du reçu
    receipt.status = 'Used'; // Statut mis à "Utilisé"
    await receiptBatch.save(); // Sauvegarder les modifications du lot

    console.log("✅ Reçu marqué comme utilisé !");
    return res.status(201).json({ message: 'Paiement enregistré avec succès.', data: marketTaxPayment });
  } catch (err) {
    console.error("❌ Erreur lors de l'enregistrement du paiement :", err.message);
    res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};
















const addPayment = async (req, res) => {
  try {
    const { taxpayerId, taxId, amountPaid } = req.body;

    logger.info("📥 Tentative d'ajout d'un paiement...");
    logger.info("📌 Données reçues :", { taxpayerId, taxId, amountPaid });

    if (!taxpayerId || !taxId || !amountPaid) {
      logger.warn("⚠️ Données manquantes ou invalides.");
      return res.status(400).json({ message: "Données manquantes ou invalides." });
    }

    const taxpayer = await Taxpayer.findById(taxpayerId).populate("user", "name phone");
    if (!taxpayer) {
      logger.warn(`⚠️ Contribuable introuvable : ${taxpayerId}`);
      return res.status(404).json({ message: "Contribuable introuvable." });
    }

    const tax = await Tax.findById(taxId);
    if (!tax) {
      logger.warn(`⚠️ Taxe introuvable : ${taxId}`);
      return res.status(404).json({ message: "Taxe introuvable." });
    }

    const taxpayerTax = await TaxpayerTax.findOne({ taxpayer: taxpayerId, tax: taxId });
    if (!taxpayerTax) {
      logger.warn("⚠️ Aucune association trouvée entre ce contribuable et cette taxe.");
      return res.status(404).json({ message: "Aucune association trouvée entre ce contribuable et cette taxe." });
    }

    if (amountPaid > taxpayerTax.remainingAmount) {
      logger.warn("⚠️ Le montant payé dépasse le montant restant.");
      return res.status(400).json({ message: "Le montant payé dépasse le montant restant pour cette taxe." });
    }

    // Ajouter le paiement dans TaxpayerTax
    const newPaymentEntry = {
      amount: amountPaid,
      date: new Date(),
      collector: req.user.id,
    };

    taxpayerTax.payments.push(newPaymentEntry);
    taxpayerTax.remainingAmount -= Number(amountPaid);
    taxpayerTax.paidAmount += Number(amountPaid);

    if (taxpayerTax.remainingAmount === 0) {
      taxpayerTax.status = "paid";
    }

    await taxpayerTax.save();

    logger.info("✅ Paiement ajouté dans TaxpayerTax :", newPaymentEntry);

    // **Créer un enregistrement dans la collection `Payment`**
    const newPayment = new Payment({
      taxpayer: taxpayerId,
      tax: taxId,
      amountPaid,
      collector: req.user.id,
      date: new Date(),
    });

    await newPayment.save();

    logger.info("✅ Paiement enregistré dans la collection `Payment` :", newPayment);

    // 🔍 Récupérer les informations du contribuable
    const taxpayerUser = taxpayer.user;
    if (taxpayerUser && taxpayerUser.phone) {
      const message = `✅ Paiement reçu !
Cher(e) ${taxpayerUser.name}, nous avons reçu ${amountPaid} FCFA pour la taxe ${tax.name}.
💰 Reste à payer : ${taxpayerTax.remainingAmount} FCFA.`;

      logger.info(`📲 Tentative d'envoi du SMS à ${taxpayerUser.phone}...`);
      const smsSent = await sendSmsNotification(taxpayerUser.phone, message);

      if (smsSent) {
        logger.info(`✅ SMS envoyé avec succès à ${taxpayerUser.phone}`);
      } else {
        logger.error(`❌ Échec de l'envoi du SMS à ${taxpayerUser.phone}`);
      }
    } else {
      logger.warn("⚠️ Aucun numéro de téléphone disponible pour l'envoi du SMS.");
    }

    res.status(201).json({
      message: "Paiement enregistré avec succès.",
      paymentId: newPayment._id,
      taxpayer: { name: taxpayerUser.name, phone: taxpayerUser.phone },
      tax: { name: tax.name },
      amountPaid,
      remainingAmount: taxpayerTax.remainingAmount,
    });

  } catch (err) {
    logger.error("❌ Erreur lors de l’enregistrement du paiement :", err);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};





const getPayments = async (req, res) => {
  try {
    console.log("===> Début de la récupération des paiements...");

    // Récupérer les paiements avec les détails nécessaires
    const payments = await TaxpayerTax.find()
      .populate({
        path: 'taxpayer',
        populate: {
          path: 'user',
          select: 'name phone', // Nom et téléphone uniquement
        },
      })
      .populate('tax', 'name') // Peupler uniquement la taxe
      .populate({
        path: 'payments.collector', // Peupler le collecteur pour les paiements partiels
        select: 'name', // Obtenir uniquement le nom
      })
      .lean();

    if (!payments || payments.length === 0) {
      console.log("Aucun paiement trouvé.");
      return res.status(404).json({ message: 'Aucun paiement trouvé.' });
    }

    console.log("Paiements récupérés avant formatage :", payments);

    // Formater les données pour inclure les paiements partiels
    const formattedPayments = payments.map((payment) => {
      console.log("==> Données brutes pour un paiement :", payment);

      const formatted = {
        id: payment._id || "ID non disponible",
        taxpayer: payment.taxpayer
          ? {
              id: payment.taxpayer._id || "ID contribuable non disponible",
              name: payment.taxpayer.user?.name || "Nom inconnu",
              phone: payment.taxpayer.user?.phone || "Téléphone inconnu",
            }
          : { name: "Contribuable inconnu", phone: "N/A" },
        tax: payment.tax
          ? {
              id: payment.tax._id || "ID taxe non disponible",
              name: payment.tax.name || "Taxe inconnue",
            }
          : { name: "Taxe inconnue" },
        totalAmount: payment.totalAmount || 0,
        paidAmount: payment.paidAmount || 0,
        remainingAmount: payment.remainingAmount || 0,
        dueDate: payment.dueDate
          ? new Date(payment.dueDate).toLocaleDateString("fr-FR")
          : "Date inconnue",
        payments: payment.payments.map((p) => ({
          amount: p.amount || 0,
          date: p.date ? new Date(p.date).toLocaleDateString("fr-FR") : "Date inconnue",
          collector: p.collector?.name || "Non attribué",
        })), // Paiements partiels formatés
      };

      console.log("==> Paiement formaté :", formatted);
      return formatted;
    });

    console.log("Données formatées pour le frontend :", formattedPayments);

    res.status(200).json(formattedPayments);
  } catch (err) {
    console.error("Erreur lors de la récupération des paiements :", err.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};






const addOccupationPayment = async (req, res) => {
  try {
    const { taxpayerId, taxId, surface } = req.body;
    logger.info("Demande d'enregistrement d'un paiement d'occupation", { taxpayerId, taxId, surface });

    // Validation des données reçues
    if (!taxpayerId || !taxId || !surface || surface <= 0) {
      logger.warn("Données manquantes ou surface invalide", { taxpayerId, taxId, surface });
      return res.status(400).json({ message: "Données manquantes ou surface invalide." });
    }

    // Récupérer la taxe pour obtenir le taux (ex : 5000 FCFA par m²)
    const tax = await Tax.findById(taxId);
    if (!tax) {
      logger.warn("Taxe introuvable", { taxId });
      return res.status(404).json({ message: "Taxe introuvable." });
    }

    // Calculer le montant à payer : surface * taux (tax.amount)
    const calculatedAmount = surface * tax.amount;
    logger.info(`Montant calculé: ${surface} m² x ${tax.amount} = ${calculatedAmount}`);

    // Créer un nouveau paiement dans la collection Payment
    const newPayment = new Payment({
      taxpayer: taxpayerId,
      tax: taxId,
      amountPaid: calculatedAmount,
      surface, // Enregistrement de la surface utilisée pour le calcul
      collector: req.user.id, // L'ID du collecteur connecté (provenant de authMiddleware)
      date: new Date()
    });
    await newPayment.save();
    logger.info("Enregistrement dans Payment réussi", newPayment);

    // Mettre à jour le document TaxpayerTax pour ce contribuable et cette taxe
    const taxpayerTax = await TaxpayerTax.findOne({ taxpayer: taxpayerId, tax: taxId });
    if (!taxpayerTax) {
      logger.warn("Document TaxpayerTax introuvable", { taxpayerId, taxId });
      return res.status(404).json({ message: "Aucune association trouvée entre le contribuable et cette taxe." });
    }

    // Mise à jour des montants cumulés
    taxpayerTax.paidAmount += calculatedAmount;
    taxpayerTax.remainingAmount -= calculatedAmount;

    // Ajouter l'entrée dans l'historique des paiements partiels
    taxpayerTax.payments.push({
      amount: calculatedAmount,
      date: new Date(),
      collector: req.user.id
    });

    // Si le montant restant est nul (ou négatif), mettre à jour le statut et fixer remainingAmount à 0
    if (taxpayerTax.remainingAmount <= 0) {
      taxpayerTax.status = 'paid';
      taxpayerTax.remainingAmount = 0;
    }

    await taxpayerTax.save();
    logger.info("Mise à jour de TaxpayerTax réussie", taxpayerTax);

    res.status(201).json({
      message: "Paiement d'occupation enregistré avec succès.",
      payment: newPayment,
      taxpayerTax
    });
  } catch (error) {
    logger.error("Erreur lors de l'enregistrement du paiement d'occupation :", error.message);
    res.status(500).json({ message: "Erreur interne du serveur." });
  }
};




// const getPaymentReceipt = async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     console.log('[getPaymentReceipt] - Recherche du paiement avec ID :', paymentId);
//     const payment = await Payment.findById(paymentId)
//       .populate({
//         path: 'taxpayer',
//         populate: { path: 'user', select: 'name phone' }
//       })
//       .populate('tax', 'name amount supportRates')
//       .populate('collector', 'name');
//     console.log('[getPaymentReceipt] - Document Payment trouvé :', payment);
//     if (!payment) {
//       console.error('[getPaymentReceipt] - Paiement non trouvé pour l’ID :', paymentId);
//       return res.status(404).json({ message: 'Paiement non trouvé' });
//     }
//     const taxpayerTax = await TaxpayerTax.findOne({
//       taxpayer: payment.taxpayer._id,
//       tax: payment.tax._id,
//     });
//     console.log('[getPaymentReceipt] - Données de TaxpayerTax trouvées :', taxpayerTax);
//     const paymentDetails = {
//       ...payment.toObject(), // Ceci inclut directement payment.surface si présent
//       totalPaid: taxpayerTax ? taxpayerTax.paidAmount : 'N/A',
//       remainingAmount: taxpayerTax ? taxpayerTax.remainingAmount : 'N/A',
//       dueDate: taxpayerTax ? taxpayerTax.dueDate : 'N/A',
//     };
//     console.log('[getPaymentReceipt] - Détails complets du paiement construits :', paymentDetails);
//     return res.status(200).json(paymentDetails);
//   } catch (error) {
//     console.error('[getPaymentReceipt] - Erreur :', error.message);
//     return res.status(500).json({ message: 'Erreur interne du serveur.' });
//   }
// };



const getPaymentReceipt = async (req, res) => {
  try {
    const { paymentId } = req.params;
    console.log('[getPaymentReceipt] - Recherche du paiement avec ID :', paymentId);

    // Récupération du document Payment avec population imbriquée
    const payment = await Payment.findById(paymentId)
      .populate({
        path: 'taxpayer',
        populate: { path: 'user', select: 'name phone' }
      })
      .populate('tax', 'name amount supportRates')
      .populate('collector', 'name');

    console.log('[getPaymentReceipt] - Document Payment trouvé :', payment);
    if (!payment) {
      console.error('[getPaymentReceipt] - Paiement non trouvé pour l’ID :', paymentId);
      return res.status(404).json({ message: 'Paiement non trouvé' });
    }

    // Récupération de l'entrée dans TaxpayerTax pour obtenir des informations complémentaires,
    // y compris la surface (qui est utilisée pour le calcul du montant total pour la taxe d'occupation).
    const taxpayerTax = await TaxpayerTax.findOne({
      taxpayer: payment.taxpayer._id,
      tax: payment.tax._id,
    });
    console.log('[getPaymentReceipt] - Données de TaxpayerTax trouvées :', taxpayerTax);

    // Construction de l'objet paymentDetails
    const paymentDetails = {
      ...payment.toObject(),
      surface: taxpayerTax?.surface || payment.surface,
      totalAmount: taxpayerTax ? taxpayerTax.totalAmount : 'N/A',
      totalPaid: taxpayerTax ? taxpayerTax.paidAmount : 'N/A',
      remainingAmount: taxpayerTax ? taxpayerTax.remainingAmount : 'N/A',
      dueDate: taxpayerTax ? taxpayerTax.dueDate : 'N/A',
    };
    

    console.log('[getPaymentReceipt] - Détails complets du paiement construits :', paymentDetails);
    return res.status(200).json(paymentDetails);
  } catch (error) {
    console.error('[getPaymentReceipt] - Erreur :', error.message);
    return res.status(500).json({ message: 'Erreur interne du serveur.' });
  }
};


  module.exports = { addPayment, getPayments, addMarketTaxPayment, addOccupationPayment , getPaymentReceipt };






