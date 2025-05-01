import axios from 'axios';
import { config } from '../config';

async function checkHealth() {
  try {
    // Vérifier la connexion à la base de données
    const dbCheck = await checkDatabase();
    
    // Vérifier l'API PayTech
    const paytechCheck = await checkPayTechAPI();
    
    // Vérifier la connexion avec le frontend
    const frontendCheck = await checkFrontend();

    console.log({
      database: dbCheck ? '✅' : '❌',
      paytech: paytechCheck ? '✅' : '❌',
      frontend: frontendCheck ? '✅' : '❌'
    });

    return dbCheck && paytechCheck && frontendCheck;
  } catch (error) {
    console.error('Erreur lors de la vérification :', error);
    return false;
  }
}

async function checkDatabase() {
  try {
    // Ajouter votre logique de vérification DB ici
    return true;
  } catch {
    return false;
  }
}

async function checkPayTechAPI() {
  try {
    const response = await axios.get(`${config.PAYTECH_BASE_URL}/status`, {
      headers: {
        'Authorization': `Bearer ${config.PAYTECH_API_KEY}`
      }
    });
    return response.status === 200;
  } catch {
    return false;
  }
}

async function checkFrontend() {
  try {
    const response = await axios.get(config.CLIENT_URL);
    return response.status === 200;
  } catch {
    return false;
  }
}

// Exécuter le script
checkHealth(); 