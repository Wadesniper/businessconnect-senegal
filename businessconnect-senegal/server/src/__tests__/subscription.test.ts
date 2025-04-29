import request from 'supertest';
import app from '../app';
import { SubscriptionService } from '../services/subscriptionService';
import { SubscriptionType, Subscription } from '../types/subscription';
import jwt from 'jsonwebtoken';
import { describe, expect, it, beforeAll } from '@jest/globals';

jest.mock('../services/subscriptionService');
jest.mock('../config/paytech');

const mockSubscriptionService = {
  createSubscription: jest.fn(),
  getSubscription: jest.fn(),
  updateSubscriptionStatus: jest.fn(),
  checkSubscriptionStatus: jest.fn()
};

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
      const mockSubscription: Subscription = {
        id: '123',
        userId,
        type: 'etudiant',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockSubscriptionService.getSubscription.mockResolvedValue(mockSubscription);

      const response = await request(app)
        .get(`/api/subscriptions/${userId}`)
        .set('Authorization', `Bearer ${authToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('userId', userId);
      expect(response.body).toHaveProperty('type');
      expect(response.body).toHaveProperty('status');
    });

    it('devrait retourner 404 si la souscription n\'existe pas', async () => {
      mockSubscriptionService.getSubscription.mockResolvedValue(null);

      const response = await request(app)
        .get('/api/subscriptions/nonexistent');

      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/subscriptions', () => {
    it('devrait créer une nouvelle souscription', async () => {
      const mockSubscription = {
        id: '123',
        userId: 'user123',
        type: 'etudiant',
        status: 'pending',
        startDate: new Date(),
        endDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockSubscriptionService.createSubscription.mockResolvedValue(mockSubscription);

      const response = await request(app)
        .post('/api/subscriptions')
        .send({
          userId: 'user123',
          type: 'etudiant'
        });

      expect(response.status).toBe(201);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toMatchObject({
        userId: 'user123',
        type: 'etudiant'
      });
    });

    it('devrait retourner une erreur si les données sont invalides', async () => {
      const response = await request(app)
        .post('/api/subscriptions')
        .send({});

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/subscriptions/payment/initiate', () => {
    it('devrait initier un paiement avec succès', async () => {
      const mockPaymentResponse = {
        redirectUrl: 'https://paytech.sn/payment/123',
        paymentId: 'pay_123'
      };

      (PayTechConfig.initiatePayment as jest.Mock).mockResolvedValue(mockPaymentResponse);

      const response = await request(app)
        .post('/api/subscriptions/payment/initiate')
        .send({
          userId: 'user123',
          subscriptionType: 'etudiant'
        });

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('redirectUrl');
      expect(response.body.data).toHaveProperty('paymentId');
    });

    it('devrait retourner une erreur si le type d\'abonnement est invalide', async () => {
      const response = await request(app)
        .post('/api/subscriptions/payment/initiate')
        .send({
          userId: 'user123',
          subscriptionType: 'invalid_type'
        });

      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/subscriptions/callback', () => {
    it('devrait traiter un callback de paiement réussi', async () => {
      const mockCallback = {
        type_event: 'SUCCESS_PAYMENT',
        custom_field: JSON.stringify({
          userId: 'user123',
          subscriptionType: 'etudiant'
        }),
        api_key_sha256: 'valid_hash',
        api_secret_sha256: 'valid_hash'
      };

      mockSubscriptionService.updateSubscriptionStatus.mockResolvedValue({
        id: '123',
        userId: 'user123',
        type: 'etudiant',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      });

      const response = await request(app)
        .post('/api/subscriptions/callback')
        .send(mockCallback);

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });
  });

  describe('GET /api/subscriptions/:userId/renewal-eligibility', () => {
    it('devrait vérifier l\'éligibilité au renouvellement', async () => {
      const mockSubscription = {
        id: '123',
        userId: 'user123',
        type: 'etudiant',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 jours avant expiration
        createdAt: new Date(),
        updatedAt: new Date()
      };

      mockSubscriptionService.getSubscription.mockResolvedValue(mockSubscription);

      const response = await request(app)
        .get('/api/subscriptions/user123/renewal-eligibility');

      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('canRenew', true);
      expect(response.body.data).toHaveProperty('daysUntilExpiration');
    });
  });
}); 