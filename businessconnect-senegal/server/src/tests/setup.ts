import dotenv from 'dotenv';
import { initTestDatabase, cleanTestDatabase } from '../config/database';
import { logger } from '../utils/logger';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import pool from '../config/database';
import { jest } from '@jest/globals';

// Charger les variables d'environnement pour les tests
dotenv.config({ path: '.env.test' });

// Configuration des variables d'environnement pour les tests
process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';

// Configuration de Jest
jest.setTimeout(30000);

let mongod: MongoMemoryServer;

beforeAll(async () => {
  // Configuration de MongoDB en mémoire pour les tests
  mongod = await MongoMemoryServer.create();
  const mongoUri = mongod.getUri();
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  await mongoose.connect(mongoUri);

  // Drop la table avant de la recréer pour éviter les erreurs de clé dupliquée
  await pool.query('DROP TABLE IF EXISTS subscriptions CASCADE;');
  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      payment_id UUID,
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
  // Création de la table PostgreSQL si elle n'existe pas
  await pool.query(`
    CREATE TABLE IF NOT EXISTS subscriptions (
      id UUID PRIMARY KEY,
      user_id UUID NOT NULL,
      type VARCHAR(50) NOT NULL,
      status VARCHAR(50) NOT NULL,
      payment_id UUID,
      start_date TIMESTAMP NOT NULL,
      end_date TIMESTAMP NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);
  // Nettoyage des tables PostgreSQL
  await pool.query('TRUNCATE TABLE subscriptions CASCADE;');
});

afterAll(async () => {
  // Fermeture des connexions
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
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