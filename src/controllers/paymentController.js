const axios = require('axios');
const Transaction = require('../models/Transaction');

const SUBSCRIPTION_TYPES = {
  etudiant: {
    amount: 1000,
    description: "Abonnement étudiant/demandeur d'emploi (1000 FCFA/mois)"
  },
  annonceur: {
    amount: 5000,
    description: 'Abonnement annonceur (5000 FCFA/mois)'
  },
  employeur: {
    amount: 9000,
    description: 'Abonnement employeur (9000 FCFA/mois)'
  }
};

exports.initPayment = async (req, res) => {
  try {
    const {
      type,
      customer_name,
      customer_surname,
      customer_email,
      customer_phone_number
    } = req.body;

    if (!SUBSCRIPTION_TYPES[type]) {
      return res.status(400).json({ message: "Type d'abonnement invalide." });
    }

    const { amount, description } = SUBSCRIPTION_TYPES[type];
    const transaction_id = Date.now().toString();

    // Enregistrer la transaction en base
    await Transaction.create({
      transaction_id,
      type,
      amount,
      customer_email,
      customer_name,
      customer_surname,
      customer_phone_number,
      status: 'PENDING'
    });

    const data = {
      apikey: process.env.CINETPAY_APIKEY,
      site_id: process.env.CINETPAY_SITE_ID,
      transaction_id,
      amount,
      currency: "XOF",
      description,
      customer_name,
      customer_surname,
      customer_email,
      customer_phone_number,
      notify_url: "https://businessconnectsenegal.com/api/payment/notify",
      return_url: "https://businessconnectsenegal.com/payment/return?transaction_id=" + transaction_id,
      channels: "ALL",
      lang: "fr"
    };

    const response = await axios.post(
      "https://api-checkout.cinetpay.com/v2/payment",
      data,
      { headers: { "Content-Type": "application/json" } }
    );

    res.json({ ...response.data, transaction_id });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de l'initialisation du paiement", error: error.message });
  }
};

exports.cinetpayNotify = async (req, res) => {
  try {
    const { transaction_id, payment_status, customer_email } = req.body;
    // Mettre à jour la transaction en base
    await Transaction.findOneAndUpdate(
      { transaction_id },
      { status: payment_status, updatedAt: new Date() }
    );
    if (payment_status === 'ACCEPTED') {
      // Ici, tu peux activer l'abonnement de l'utilisateur en base
      // Exemple : await User.updateOne({ email: customer_email }, { abonnementActif: true });
      console.log(`Paiement accepté pour ${customer_email} (transaction ${transaction_id})`);
    } else {
      console.log(`Paiement refusé ou en attente pour ${customer_email} (transaction ${transaction_id})`);
    }
    res.status(200).send('OK');
  } catch (error) {
    res.status(500).json({ message: "Erreur lors du traitement de la notification CinetPay", error: error.message });
  }
};

exports.getPaymentStatus = async (req, res) => {
  try {
    const { transaction_id } = req.query;
    const transaction = await Transaction.findOne({ transaction_id });
    if (!transaction) {
      return res.status(404).json({ status: 'NOT_FOUND' });
    }
    res.json({ status: transaction.status });
  } catch (error) {
    res.status(500).json({ message: "Erreur lors de la récupération du statut de paiement", error: error.message });
  }
}; 