import request from 'supertest';
import app from '../app';
import { SubscriptionService } from '../services/subscriptionService';
import jwt from 'jsonwebtoken';
import { describe, expect, it, beforeAll } from '@jest/globals';

describe('Routes d\'abonnement', () => {
  let authToken: string;
  const userId = '123456';

  beforeAll(() => {
    // Créer un token JWT valide pour les tests
    authToken = jwt.sign(
      { userId, email: 'test@example.com' },
      process.env.JWT_SECRET || 'test_secret'
    );
  });

  describe('GET /:userId', () => {
    it('devrait retourner un abonnement existant', async () => {
      const response = await request(app)
        .get(`/api/subscriptions/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', userId);
      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('status');
    });

    it('devrait retourner 404 pour un utilisateur sans abonnement', async () => {
      const nonExistentUserId = '999999';
      const response = await request(app)
        .get(`/api/subscriptions/${nonExistentUserId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('message', 'Abonnement non trouvé');
    });

    it('devrait retourner 401 sans token d\'authentification', async () => {
      const response = await request(app)
        .get(`/api/subscriptions/${userId}`);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty('message', 'Token d\'authentification manquant');
    });
  });

  describe('POST /initiate', () => {
    it('devrait initier un nouvel abonnement', async () => {
      const subscriptionData = {
        userId,
        subscriptionType: 'etudiant'
      };

      const response = await request(app)
        .post('/api/subscriptions/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(subscriptionData);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('paymentUrl');
      expect(response.body).toHaveProperty('reference');
    });

    it('devrait retourner 400 pour des données invalides', async () => {
      const invalidData = {
        userId
        // subscriptionType manquant
      };

      const response = await request(app)
        .post('/api/subscriptions/initiate')
        .set('Authorization', `Bearer ${authToken}`)
        .send(invalidData);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('message', 'UserId et type d\'abonnement requis');
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
      expect(response.body).toHaveProperty('message', 'Paiement confirmé et abonnement activé');
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
      expect(response.body).toHaveProperty('message', 'Échec du paiement');
    });
  });

  describe('GET /:userId/status', () => {
    it('devrait retourner le statut de l\'abonnement', async () => {
      const response = await request(app)
        .get(`/api/subscriptions/${userId}/status`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status');
    });
  });
}); 