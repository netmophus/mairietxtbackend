
// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   taxpayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxpayer', required: true }, // Contribuable
//   collector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Collecteur
//   tax: { type: mongoose.Schema.Types.ObjectId, ref: 'Tax', required: true }, // Taxe
//   amount: { type: Number, required: true }, // Montant payé
//   paymentDate: { type: Date, default: Date.now }, // Date du paiement
// });

// module.exports = mongoose.model('Payment', paymentSchema);




// Payment Model
const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  taxpayer: { type: mongoose.Schema.Types.ObjectId, ref: 'Taxpayer', required: true },
  tax: { type: mongoose.Schema.Types.ObjectId, ref: 'Tax', required: true },
  amountPaid: { type: Number, required: true },
  // Champ pour enregistrer la surface occupée (en m²) – utile pour le calcul de la taxe d'occupation
  surface: { type: Number },
  receiptId: { type: mongoose.Schema.Types.ObjectId, ref: 'ReceiptBatch' }, // Optionnel
  date: { type: Date, default: Date.now },
  collector: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

module.exports = mongoose.model('Payment', paymentSchema);

