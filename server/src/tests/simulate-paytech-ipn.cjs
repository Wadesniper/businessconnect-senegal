const crypto = require('crypto');
const axios = require('axios');

// Configuration PayTech (même que le backend)
const PAYTECH_API_KEY = '56767e6e98794dfccd27294deaa0e1fab9c24d281867e3f434f39a1729701704';
const PAYTECH_API_SECRET = 'ab67641b53d0552c35b025a2b113fede4e0aa31608f15d08a3687dcfde3c7c4c';

// Générer les hash SHA256 comme PayTech
const apiKeyHash = crypto.createHash('sha256').update(PAYTECH_API_KEY).digest('hex');
const apiSecretHash = crypto.createHash('sha256').update(PAYTECH_API_SECRET).digest('hex');

// Simuler un paiement réussi
const simulatePayment = async (token) => {
  try {
    const ipnData = {
      type_event: 'sale_complete',
      api_key_sha256: apiKeyHash,
      api_secret_sha256: apiSecretHash,
      token: token,
      ref_command: `BCS-TEST-${Date.now()}`,
      amount: 1000,
      currency: 'XOF',
      custom_field: JSON.stringify({
        userId: 'test-user-id',
        type: 'etudiant',
        email: 'test@example.com'
      })
    };

    console.log('[TEST] Envoi IPN PayTech:', ipnData);
    
    // Envoyer l'IPN au backend
    const response = await axios.post('https://web-production-38372.up.railway.app/api/subscriptions/ipn', ipnData);
    
    console.log('[TEST] Réponse du backend:', response.data);
    return response.data;
  } catch (error) {
    console.error('[TEST] Erreur:', error.response?.data || error.message);
    throw error;
  }
};

// Exécuter le test
const token = process.argv[2];
if (!token) {
  console.error('Usage: node simulate-paytech-ipn.js <token>');
  process.exit(1);
}

simulatePayment(token)
  .then(() => console.log('[TEST] Test terminé avec succès'))
  .catch(() => process.exit(1)); 