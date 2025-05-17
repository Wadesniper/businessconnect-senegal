import request from 'supertest';
import app from '../app';
import { SubscriptionService } from '../services/subscriptionService';
import jwt from 'jsonwebtoken';
import { describe, expect, it, beforeAll, afterAll, beforeEach } from '@jest/globals';
import { Pool } from 'pg';
import { config } from '../config';
import { v4 as uuidv4 } from 'uuid';

const pool = new Pool({
  connectionString: config.DATABASE_URL
});

const subscriptionService = new SubscriptionService();

beforeAll(async () => {
  // Setup test database
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
    )
  `);
});

beforeEach(async () => {
  // Nettoyer la table avant chaque test
  await pool.query('DELETE FROM subscriptions');
});

afterAll(async () => {
  // Cleanup global
  await pool.query('DROP TABLE IF EXISTS subscriptions');
  await pool.end();
});

describe('Routes d\'abonnement', () => {
  function getAuth(userId: string) {
    const jwtSecret: any = process.env.JWT_SECRET || 'default_secret';
    const jwtExpire: any = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '7d';
    const options: jwt.SignOptions = { expiresIn: jwtExpire };
    return jwt.sign({ id: userId }, jwtSecret, options);
  }

  describe('GET /:userId', () => {
    it('devrait retourner un abonnement existant', async () => {
      const userId = uuidv4();
      const authToken = getAuth(userId);
      // Insérer un abonnement actif pour ce test
      const created = await subscriptionService.createSubscription(userId, 'etudiant');
      await subscriptionService.updateSubscriptionStatus(created.id, 'active');
      console.log('[TEST] Abonnement inséré via service', created);
      const response = await request(app)
        .get(`/api/subscriptions/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);
      console.log('[TEST] Réponse GET /:userId', response.status, response.body);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('user_id', userId);
      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('status');
    });

    it('devrait retourner 404 pour un utilisateur sans abonnement', async () => {
      const userId = uuidv4();
      const authToken = getAuth(userId);
      const response = await request(app)
        .get(`/api/subscriptions/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Abonnement non trouvé');
    });

    it('devrait retourner 401 sans token d\'authentification', async () => {
      const userId = uuidv4();
      const response = await request(app)
        .get(`/api/subscriptions/${userId}`);
      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /initiate', () => {
    it('devrait initier un nouvel abonnement', async () => {
      const userId = uuidv4();
      const authToken = getAuth(userId);
      const subscriptionData = {
        userId,
        subscriptionType: 'etudiant',
        customer_name: 'Test',
        customer_surname: 'User',
        customer_email: 'test@example.com',
        customer_phone_number: '770000000'
      };
      const response = await request(app)
        .post('/api/subscriptions/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(subscriptionData);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('paymentUrl');
    });

    it('devrait retourner 400 pour des données invalides', async () => {
      const userId = uuidv4();
      const authToken = getAuth(userId);
      const invalidData = {
        userId
        // subscriptionType et autres champs manquants
      };
      const response = await request(app)
        .post('/api/subscriptions/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Paramètres manquants');
    });
  });

  describe('POST /payment-callback', () => {
    it('devrait activer l\'abonnement après un paiement réussi', async () => {
      const userId = uuidv4();
      // Insérer un abonnement pending pour simuler le paiement
      const created = await subscriptionService.createSubscription(userId, 'etudiant');
      console.log('[TEST] Abonnement pending inséré via service', created);
      const callbackData = {
        reference: 'REF123',
        status: 'success',
        userId
      };
      const response = await request(app)
        .post('/api/subscriptions/payment-callback')
        .send(callbackData);
      console.log('[TEST] Réponse POST /payment-callback success', response.status, response.body);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('message', 'Abonnement activé');
    });

    it('devrait marquer l\'abonnement comme expiré après un échec de paiement', async () => {
      const userId = uuidv4();
      // Insérer un abonnement pending pour simuler le paiement
      const created = await subscriptionService.createSubscription(userId, 'etudiant');
      console.log('[TEST] Abonnement pending inséré via service', created);
      const callbackData = {
        reference: 'REF124',
        status: 'failed',
        userId
      };
      const response = await request(app)
        .post('/api/subscriptions/payment-callback')
        .send(callbackData);
      console.log('[TEST] Réponse POST /payment-callback failed', response.status, response.body);
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('error', 'Paiement échoué, abonnement expiré');
    });
  });

  describe('GET /:userId/status', () => {
    it('devrait retourner le statut de l\'abonnement', async () => {
      const userId = uuidv4();
      const authToken = getAuth(userId);
      // Insérer un abonnement actif pour ce test
      const created = await subscriptionService.createSubscription(userId, 'etudiant');
      await subscriptionService.updateSubscriptionStatus(created.id, 'active');
      console.log('[TEST] Abonnement actif inséré via service', created);
      const response = await request(app)
        .get(`/api/subscriptions/${userId}/status`)
        .set('Authorization', `Bearer ${authToken}`);
      console.log('[TEST] Réponse GET /:userId/status', response.status, response.body);
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isActive');
      expect(response.body.isActive).toBe(true);
    });
  });
});

describe('Subscription Service', () => {
  let testUserId: string;
  beforeEach(() => {
    testUserId = uuidv4();
  });

  test('should create a new subscription', async () => {
    const subscription = await subscriptionService.createSubscription(testUserId, 'etudiant');
    console.log('[TEST] Service createSubscription', subscription);
    expect(subscription).toBeDefined();
    expect(subscription.type).toBe('etudiant');
    expect(subscription.status).toBe('pending');
  });

  test('should get active subscription', async () => {
    // Créer un abonnement actif pour ce test
    const created = await subscriptionService.createSubscription(testUserId, 'etudiant');
    await subscriptionService.updateSubscriptionStatus(created.id, 'active');
    const subscription = await subscriptionService.getActiveSubscription(testUserId);
    console.log('[TEST] Service getActiveSubscription', subscription);
    expect(subscription).toBeDefined();
    if (subscription) {
      expect(subscription.status).toBe('active');
    }
  });
}); 