import dotenv from 'dotenv';
import { initTestDatabase, cleanTestDatabase } from '../config/database';
import { logger } from '../utils/logger';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

// Charger les variables d'environnement pour les tests
dotenv.config({ path: '.env.test' });

// Configuration des variables d'environnement pour les tests
process.env.JWT_SECRET = 'test_secret';
process.env.NODE_ENV = 'test';
process.env.TEST_DATABASE_URL = 'postgresql://postgres:postgres@localhost:5432/businessconnect_test';
process.env.PAYTECH_API_KEY = 'test_api_key';
process.env.PAYTECH_API_SECRET = 'test_api_secret';

// Mock du logger pour éviter les logs pendant les tests
jest.mock('../utils/logger', () => ({
  logger: {
    info: jest.fn(),
    error: jest.fn(),
    warn: jest.fn(),
    debug: jest.fn()
  }
}));

// Mock des dépendances externes
jest.mock('../services/subscription.service');
jest.mock('../config/paytech');

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

beforeEach(async () => {
  const collections = await mongoose.connection.db.collections();
  for (const collection of collections) {
    await collection.deleteMany({});
  }
});

// Initialiser la base de données avant tous les tests
beforeAll(async () => {
  try {
    await initTestDatabase();
  } catch (error) {
    logger.error('Erreur lors de l\'initialisation de la base de données de test:', error);
    process.exit(1);
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