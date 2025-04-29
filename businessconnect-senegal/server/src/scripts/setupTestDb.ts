import { Client } from 'pg';
import dotenv from 'dotenv';
import { logger } from '../utils/logger';

dotenv.config({ path: '.env.test' });

const setupTestDatabase = async () => {
  const client = new Client({
    connectionString: 'postgresql://postgres:postgres@localhost:5432/postgres'
  });

  try {
    await client.connect();
    
    // Vérifier si la base de données de test existe
    const checkDb = await client.query(
      "SELECT 1 FROM pg_database WHERE datname = 'businessconnect_test'"
    );

    // Créer la base de données si elle n'existe pas
    if (checkDb.rowCount === 0) {
      // S'assurer qu'il n'y a pas de connexions actives
      await client.query(
        "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'businessconnect_test'"
      );
      
      await client.query('CREATE DATABASE businessconnect_test');
      logger.info('Base de données de test créée avec succès');
    } else {
      logger.info('La base de données de test existe déjà');
    }

  } catch (error) {
    logger.error('Erreur lors de la configuration de la base de données de test:', error);
    process.exit(1);
  } finally {
    await client.end();
  }
};

setupTestDatabase().catch((error) => {
  logger.error('Erreur non gérée:', error);
  process.exit(1);
}); 