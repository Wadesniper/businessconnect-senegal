const crypto = require('crypto');

// Simuler les variables d'environnement comme dans le backend
const PAYTECH_API_KEY = '56767e6e98794dfccd27294deaa0e1fab9c24d281867e3f434f39a1729701704';
const PAYTECH_API_SECRET = 'ab67641b53d0552c35b025a2b113fede4e0aa31608f15d08a3687dcfde3c7c4c';

// Afficher les valeurs brutes pour debug
console.log('[DEBUG] PAYTECH_API_KEY:', PAYTECH_API_KEY);
console.log('[DEBUG] PAYTECH_API_SECRET:', PAYTECH_API_SECRET);

// Calculer les hash comme dans le backend
const apiKeyHash = crypto.createHash('sha256').update(PAYTECH_API_KEY).digest('hex');
const apiSecretHash = crypto.createHash('sha256').update(PAYTECH_API_SECRET).digest('hex');

// Afficher les hash pour debug
console.log('[DEBUG] apiKeyHash:', apiKeyHash);
console.log('[DEBUG] apiSecretHash:', apiSecretHash);

const body = {
  type_event: "sale_complete",
  custom_field: JSON.stringify({ userId: "cmbsghhxe0001pk01gxa91k9n", type: "etudiant" }),
  ref_command: "TEST-REF-123456",
  item_name: "Abonnement Etudiant",
  item_price: "1000",
  item_price_xof: "1000",
  final_item_price: "1000",
  currency: "xof",
  command_name: "Abonnement Etudiant Pour Test",
  token: "405gzqpmbtyohl9",
  env: "prod",
  payment_method: "Test",
  client_phone: "770000000",
  api_key_sha256: apiKeyHash,
  api_secret_sha256: apiSecretHash,
};

console.log('curl -X POST "https://web-production-38372.up.railway.app/api/subscriptions/ipn" \\');
console.log('  -H "Content-Type: application/json" \\');
console.log('  -d \'', JSON.stringify(body), '\''); 