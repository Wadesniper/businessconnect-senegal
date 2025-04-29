import { Pool } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? {
    rejectUnauthorized: false
  } : false
});

pool.on('error', (err) => {
  logger.error('Erreur inattendue du pool PostgreSQL:', err);
  process.exit(-1);
});

// Fonction utilitaire pour exécuter des requêtes
export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result;
  } finally {
    client.release();
  }
};

export default pool;

// Fonction pour initialiser la base de données de test
export const initTestDatabase = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Cette fonction ne doit être appelée que dans l\'environnement de test');
  }

  try {
    // Créer les tables nécessaires pour les tests
    await query(`
      CREATE TABLE IF NOT EXISTS subscriptions (
        id SERIAL PRIMARY KEY,
        user_id VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) NOT NULL,
        start_date TIMESTAMP NOT NULL,
        end_date TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    logger.info('Base de données de test initialisée avec succès');
  } catch (error) {
    logger.error('Erreur lors de l\'initialisation de la base de données de test', error);
    throw error;
  }
};

// Fonction pour nettoyer la base de données de test
export const cleanTestDatabase = async () => {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('Cette fonction ne doit être appelée que dans l\'environnement de test');
  }

  try {
    await query('TRUNCATE TABLE subscriptions CASCADE');
    logger.info('Base de données de test nettoyée avec succès');
  } catch (error) {
    logger.error('Erreur lors du nettoyage de la base de données de test', error);
    throw error;
  }
};

// Fonction de test de connexion
export const testConnection = async () => {
  try {
    const client = await pool.connect();
    console.log('Connexion à PostgreSQL réussie !');
    client.release();
    return true;
  } catch (error) {
    console.error('Erreur de connexion à PostgreSQL:', error);
    return false;
  }
}; 