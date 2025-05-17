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

describe('Routes d\'abonnement', () => {
  let authToken: string;
  const userId = '123456';

  beforeAll(() => {
    // Créer un token JWT valide pour les tests
    const jwtSecret: any = process.env.JWT_SECRET || 'default_secret';
    const jwtExpire: any = process.env.JWT_EXPIRE || process.env.JWT_EXPIRES_IN || '7d';
    const options: jwt.SignOptions = { expiresIn: jwtExpire };
    authToken = jwt.sign(
      { id: userId },
      jwtSecret,
      options
    );
  });

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
    // Insérer un abonnement de test pour les tests GET
    await pool.query(`
      INSERT INTO subscriptions (id, user_id, type, status, start_date, end_date, created_at, updated_at)
      VALUES ($1, $2, $3, $4, NOW(), NOW() + INTERVAL '30 days', NOW(), NOW())
    `, [uuidv4(), userId, 'etudiant', 'active']);
  });

  afterAll(async () => {
    // Cleanup
    await pool.query('DROP TABLE IF EXISTS subscriptions');
    await pool.end();
  });

  describe('GET /:userId', () => {
    it('devrait retourner un abonnement existant', async () => {
      const response = await request(app)
        .get(`/api/subscriptions/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('user_id', userId);
      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('status');
    });

    it('devrait retourner 404 pour un utilisateur sans abonnement', async () => {
      const nonExistentUserId = '999999';
      const response = await request(app)
        .get(`/api/subscriptions/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('error', 'Abonnement non trouvé');
    });

    it('devrait retourner 401 sans token d\'authentification', async () => {
      const response = await request(app)
        .get(`/api/subscriptions/${userId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('POST /initiate', () => {
    it('devrait initier un nouvel abonnement', async () => {
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
      const callbackData = {
        reference: 'REF123',
        status: 'success',
        userId
      };

      const response = await request(app)
        .post('/api/subscriptions/payment-callback')
        .send(callbackData);

      expect(response.status).toBe(200);
      // Adapter selon la réponse réelle de l'API
    });

    it('devrait marquer l\'abonnement comme expiré après un échec de paiement', async () => {
      const callbackData = {
        reference: 'REF124',
        status: 'failed',
        userId
      };

      const response = await request(app)
        .post('/api/subscriptions/payment-callback')
        .send(callbackData);

      expect(response.status).toBe(400);
      // Adapter selon la réponse réelle de l'API
    });
  });

  describe('GET /:userId/status', () => {
    it('devrait retourner le statut de l\'abonnement', async () => {
      const response = await request(app)
        .get(`/api/subscriptions/${userId}/status`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('isActive');
    });
  });
});

describe('Subscription Service', () => {
  test('should create a new subscription', async () => {
    const subscriptionService = new SubscriptionService();
    const subscription = await subscriptionService.createSubscription('test-user', 'etudiant');

    expect(subscription).toBeDefined();
    expect(subscription.type).toBe('etudiant');
    expect(subscription.status).toBe('pending');
  });

  test('should get active subscription', async () => {
    const subscriptionService = new SubscriptionService();
    const userId = '123e4567-e89b-12d3-a456-426614174000';
    
    const subscription = await subscriptionService.getActiveSubscription(userId);
    expect(subscription).toBeDefined();
  });
}); 