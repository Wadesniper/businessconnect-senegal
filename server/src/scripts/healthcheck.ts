import axios from 'axios';
import { config } from '../config';

async function checkHealth() {
  try {
    // Vérifier la connexion à la base de données
    const dbCheck = await checkDatabase();
    
    // Vérifier la connexion avec le frontend
    const frontendCheck = await checkFrontend();

    console.log({
      database: dbCheck ? '✅' : '❌',
      frontend: frontendCheck ? '✅' : '❌'
    });

    return dbCheck && frontendCheck;
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