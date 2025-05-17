import dotenv from 'dotenv';
import { initTestDatabase, cleanTestDatabase } from '../config/database';
import { logger } from '../utils/logger';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import { Pool } from 'pg';
import { jest } from '@jest/globals';

// Charger les variables d'environnement pour les tests
dotenv.config({ path: '.env.test' });

// Configuration des variables d'environnement pour les tests
process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';
process.env.TEST_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/businessconnect_test';

// Configuration de Jest
jest.setTimeout(10000);

let mongod: MongoMemoryServer;
let pool: Pool;

beforeAll(async () => {
  // Configuration de MongoDB en mémoire pour les tests
  mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  await mongoose.connect(mongoUri);

  // Configuration de PostgreSQL pour les tests
  pool = new Pool({
    host: 'localhost',
    port: 5432,
    database: 'test_db',
    user: 'test_user',
    password: 'test_password'
  });

  // Création des tables nécessaires
  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id VARCHAR(255) PRIMARY KEY,
      user_id VARCHAR(255) NOT NULL,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      payment_id VARCHAR(255),
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
});

beforeEach(async () => {
  // Nettoyage des collections MongoDB
  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();
    for (const collection of collections) {
      await collection.deleteMany({});
    }
  }

  // Nettoyage des tables PostgreSQL
  await pool.query('TRUNCATE TABLE subscriptions CASCADE;');
});

afterAll(async () => {
  // Fermeture des connexions
  await mongoose.disconnect();
  await mongod.stop();
  await pool.end();
});

// Mock global du logger
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

// Mock des dépendances externes
jest.mock('../services/subscriptionService');

// Initialiser la base de données avant tous les tests
beforeAll(async () => {
  try {
    await initTestDatabase();
  } catch (error) {
    logger.error('Erreur lors de l\'initialisation de la base de données de test:', error);
    throw error;
  }
});

// Nettoyer la base de données après chaque test
afterEach(async () => {
  try {
    await cleanTestDatabase();
    jest.clearAllMocks();
  } catch (error) {
    logger.error('Erreur lors du nettoyage de la base de données de test:', error);
  }
});

// Fermer la connexion à la base de données après tous les tests
afterAll(async () => {
  try {
    await cleanTestDatabase();
  } catch (error) {
    logger.error('Erreur lors du nettoyage final de la base de données:', error);
  }
}); 