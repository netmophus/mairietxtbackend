// const { Vonage } = require("@vonage/server-sdk");
// const logger = require("./logger");

// const vonage = new Vonage({
//   apiKey: process.env.VONAGE_API_KEY,
//   apiSecret: process.env.VONAGE_API_SECRET,
// });

// const sendSmsNotification = async (phoneNumber, message) => {
//   try {
//     if (!phoneNumber) {
//       logger.warn("⚠️ Tentative d'envoi de SMS avec un numéro manquant !");
//       return false;
//     }

//     logger.info(`📲 Envoi du SMS à ${phoneNumber} : "${message}"`);
    
//     const response = await vonage.sms.send({
//       from: "SOFTLINK",
//       to: phoneNumber,
//       text: message,
//     });

//     logger.info(`✅ SMS envoyé avec succès à ${phoneNumber}`);
//     return true;
//   } catch (error) {
//     logger.error(`❌ Erreur d'envoi de SMS à ${phoneNumber} : ${error.message}`);
//     return false;
//   }
// };

// module.exports = sendSmsNotification;


const axios = require("axios");
const logger = require("./logger");

const API_URL = "https://textbelt.com/text"; // URL de l'API Textbelt
const API_KEY = "62588af64f9bcc3b2e0945dd722f06a76ec769ceQz5qBlahtAeqyXtnmAD0oYy6c";
const SENDER_NAME = "netmorphus@hotmail.com"; // Sender Name fourni

// Fonction pour envoyer un SMS via Textbelt
const sendSmsNotification = async (phoneNumber, message) => {
  try {
    if (!phoneNumber) {
      logger.warn("⚠️ Numéro de téléphone manquant !");
      return false;
    }

    logger.info(`📲 Envoi du SMS à ${phoneNumber} : "${message}" avec Sender Name: ${SENDER_NAME}`);

    const response = await axios.post(
      API_URL,
      {
        phone: phoneNumber, // Numéro du destinataire
        message: message, // Contenu du message
        key: API_KEY, // API Key Textbelt
        sender: SENDER_NAME, // Sender Name (nom de l'expéditeur)
      }
    );

    logger.info(`✅ Réponse Textbelt : ${JSON.stringify(response.data)}`);

    if (response.data.success) {
      logger.info(`✅ SMS envoyé avec succès à ${phoneNumber}`);
      return true;
    } else {
      logger.error(`❌ Échec de l'envoi du SMS : ${response.data.error}`);
      return false;
    }
  } catch (error) {
    logger.error(`❌ Erreur lors de l'envoi du SMS : ${error.message}`);
    return false;
  }
};

module.exports = sendSmsNotification;
