import request from 'supertest';
import { app } from '../app';
import { SubscriptionService } from '../services/subscriptionService';
import { NotificationService } from '../services/notificationService';
import { PayTech } from '../services/paytechService';
import { jest } from '@jest/globals';
import jwt from 'jsonwebtoken';

// Mock des services
jest.mock('../services/notificationService');
jest.mock('../services/paytechService');
jest.mock('../utils/logger');
jest.mock('../config/database', () => ({
  query: jest.fn()
}));

describe('Routes de souscription', () => {
  let mockToken: string;
  let subscriptionService: SubscriptionService;

  beforeAll(() => {
    // Création d'un token JWT valide pour les tests
    mockToken = jwt.sign(
      { id: 'testuser', email: 'test@example.com' },
      process.env.JWT_SECRET || 'test_secret'
    );
  });

  beforeEach(() => {
    jest.clearAllMocks();
    
    const notificationService = new NotificationService({ daysBeforeExpiration: [7, 3, 1] });
    const payTechService = new PayTech(
      'test-key',
      'test-secret',
      'https://test.paytech.sn'
    );
    
    subscriptionService = new SubscriptionService(notificationService, payTechService);
  });

  describe('GET /:userId', () => {
    it('devrait retourner l\'abonnement d\'un utilisateur', async () => {
      const mockSubscription = {
        id: 'sub123',
        userId: 'testuser',
        type: 'etudiant',
        status: 'active',
        startDate: new Date(),
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
      };

      jest.spyOn(subscriptionService, 'getSubscription').mockResolvedValue(mockSubscription);

      const response = await request(app)
        .get('/api/subscriptions/testuser')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockSubscription);
    });

    it('devrait retourner 404 si l\'abonnement n\'existe pas', async () => {
      jest.spyOn(subscriptionService, 'getSubscription').mockResolvedValue(null);

      const response = await request(app)
        .get('/api/subscriptions/nonexistent')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(404);
    });
  });

  describe('POST /initiate', () => {
    it('devrait initier un nouveau paiement', async () => {
      const mockPaymentInitiation = {
        redirectUrl: 'https://payment.url',
        paymentId: 'payment123'
      };

      jest.spyOn(subscriptionService, 'initiatePayment').mockResolvedValue(mockPaymentInitiation);

      const response = await request(app)
        .post('/api/subscriptions/initiate')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({
          userId: 'testuser',
          subscriptionType: 'etudiant'
        });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        success: true,
        data: mockPaymentInitiation
      });
    });

    it('devrait retourner 400 si les données sont manquantes', async () => {
      const response = await request(app)
        .post('/api/subscriptions/initiate')
        .set('Authorization', `Bearer ${mockToken}`)
        .send({});

      expect(response.status).toBe(400);
    });
  });

  describe('POST /payment-callback', () => {
    it('devrait traiter un callback de paiement réussi', async () => {
      const mockCallback = {
        type_event: 'SUCCESS_PAYMENT',
        custom_field: JSON.stringify({ userId: 'testuser' }),
        payment_id: 'payment123',
        amount: 5000,
        transaction_id: 'trans123',
        api_key_sha256: 'valid_hash',
        api_secret_sha256: 'valid_hash'
      };

      jest.spyOn(subscriptionService, 'handlePaymentCallback').mockResolvedValue();

      const response = await request(app)
        .post('/api/subscriptions/payment-callback')
        .send(mockCallback);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Callback traité avec succès'
      });
    });

    it('devrait rejeter un callback invalide', async () => {
      const mockCallback = {
        type_event: 'SUCCESS_PAYMENT',
        custom_field: JSON.stringify({ userId: 'testuser' }),
        payment_id: 'payment123',
        amount: 5000,
        transaction_id: 'trans123',
        api_key_sha256: 'invalid_hash',
        api_secret_sha256: 'invalid_hash'
      };

      const response = await request(app)
        .post('/api/subscriptions/payment-callback')
        .send(mockCallback);

      expect(response.status).toBe(403);
    });
  });

  describe('GET /:userId/status', () => {
    it('devrait retourner le statut d\'un abonnement actif', async () => {
      jest.spyOn(subscriptionService, 'checkSubscriptionStatus').mockResolvedValue(true);

      const response = await request(app)
        .get('/api/subscriptions/testuser/status')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ isActive: true });
    });

    it('devrait retourner le statut d\'un abonnement inactif', async () => {
      jest.spyOn(subscriptionService, 'checkSubscriptionStatus').mockResolvedValue(false);

      const response = await request(app)
        .get('/api/subscriptions/testuser/status')
        .set('Authorization', `Bearer ${mockToken}`);

      expect(response.status).toBe(200);
      expect(response.body).toEqual({ isActive: false });
    });
  });
}); 