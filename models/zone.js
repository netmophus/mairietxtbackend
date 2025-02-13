
// const mongoose = require('mongoose');

// const zoneSchema = new mongoose.Schema({
//   name: { type: String, required: true }, // Nom de la zone
//   description: { type: String }, // Description optionnelle
//   createdAt: { type: Date, default: Date.now }, // Date de création
// });

// module.exports = mongoose.model('Zone', zoneSchema);



// Zone Model

const mongoose = require('mongoose');


const zoneSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  createdAt: { type: Date, default: Date.now },
});

zoneSchema.index({ name: 1 });

module.exports = mongoose.model('Zone', zoneSchema);