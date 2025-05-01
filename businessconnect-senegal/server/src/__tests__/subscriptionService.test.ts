import { describe, expect, it, beforeEach } from '@jest/globals';
import { SubscriptionService } from '../services/subscriptionService';
import { Subscription, SubscriptionStatus, SubscriptionType } from '../types/subscription';
import { NotificationService } from '../services/notificationService';
import { PayTech } from '../services/paytechService';
import { PayTechCallbackData } from '../types/subscription';
import { jest } from '@jest/globals';

// Mock des dépendances
jest.mock('../services/notificationService');
jest.mock('../services/paytechService');
jest.mock('../utils/logger');
jest.mock('../config/database', () => ({
  query: jest.fn()
}));

describe('SubscriptionService', () => {
  let subscriptionService: SubscriptionService;
  let mockNotificationService: jest.Mocked<NotificationService>;
  let mockPayTechService: jest.Mocked<PayTech>;

  beforeEach(() => {
    // Réinitialisation des mocks
    jest.clearAllMocks();
    
    mockNotificationService = new NotificationService({ daysBeforeExpiration: [7, 3, 1] }) as jest.Mocked<NotificationService>;
    mockPayTechService = new PayTech('test-key', 'test-secret') as jest.Mocked<PayTech>;
    
    subscriptionService = new SubscriptionService(mockNotificationService, mockPayTechService);
  });

  describe('createSubscription', () => {
    it('devrait créer une nouvelle souscription', async () => {
      const userId = '123';
      const type: SubscriptionType = 'etudiant';

      const subscription = await subscriptionService.createSubscription(userId, type);

      expect(subscription).toBeDefined();
      expect(subscription.userId).toBe(userId);
      expect(subscription.type).toBe(type);
      expect(subscription.status).toBe('pending');
    });
  });

  describe('getSubscription', () => {
    it('devrait retourner une souscription existante', async () => {
      const userId = '123';
      const type: SubscriptionType = 'etudiant';

      const createdSubscription = await subscriptionService.createSubscription(userId, type);
      const retrievedSubscription = await subscriptionService.getSubscription(userId);

      expect(retrievedSubscription).toEqual(createdSubscription);
    });

    it('devrait retourner null pour un utilisateur inexistant', async () => {
      const subscription = await subscriptionService.getSubscription('nonexistent');
      expect(subscription).toBeNull();
    });
  });

  describe('updateSubscriptionStatus', () => {
    it('devrait mettre à jour le statut d\'une souscription', async () => {
      const userId = '123';
      const type: SubscriptionType = 'etudiant';
      const newStatus: SubscriptionStatus = 'active';

      await subscriptionService.createSubscription(userId, type);
      const updatedSubscription = await subscriptionService.updateSubscriptionStatus(userId, newStatus);

      expect(updatedSubscription?.status).toBe(newStatus);
    });
  });

  describe('initiatePayment', () => {
    it('devrait initier un paiement avec succès', async () => {
      const userId = 'user123';
      const type: SubscriptionType = 'etudiant';
      const mockPaymentResponse = {
        id: 'payment123',
        next_action: {
          redirect_url: 'https://payment.url'
        }
      };

      // Mock des méthodes
      jest.spyOn(subscriptionService, 'getActiveSubscription').mockResolvedValue(null);
      (mockPayTechService.createPaymentIntent as jest.Mock).mockResolvedValue(mockPaymentResponse);
      jest.spyOn(subscriptionService, 'createSubscription').mockResolvedValue({} as Subscription);

      const result = await subscriptionService.initiatePayment(userId, type);

      expect(result).toEqual({
        redirectUrl: 'https://payment.url',
        paymentId: 'payment123'
      });
      expect(mockPayTechService.createPaymentIntent).toHaveBeenCalledWith(expect.objectContaining({
        amount: 5000,
        currency: 'XOF',
        customer: userId
      }));
    });

    it('devrait rejeter si l\'utilisateur a déjà un abonnement actif', async () => {
      const userId = 'user123';
      const type: SubscriptionType = 'etudiant';
      
      jest.spyOn(subscriptionService, 'getActiveSubscription').mockResolvedValue({} as Subscription);

      await expect(subscriptionService.initiatePayment(userId, type))
        .rejects.toThrow('Utilisateur a déjà un abonnement actif');
    });
  });

  describe('handlePaymentCallback', () => {
    it('devrait traiter un callback de paiement réussi', async () => {
      const mockSubscription = {
        id: 'sub123',
        userId: 'user123'
      } as Subscription;

      const callbackData: PayTechCallbackData = {
        paymentId: 'payment123',
        amount: 5000,
        status: 'completed',
        customField: '{}',
        transactionId: 'trans123'
      };

      jest.spyOn(subscriptionService, 'getSubscriptionByPaymentId').mockResolvedValue(mockSubscription);
      jest.spyOn(subscriptionService, 'updateSubscriptionStatus').mockResolvedValue();

      await subscriptionService.handlePaymentCallback(callbackData);

      expect(subscriptionService.updateSubscriptionStatus).toHaveBeenCalledWith(mockSubscription.id, 'active');
      expect(mockNotificationService.sendPaymentSuccessNotification).toHaveBeenCalledWith(mockSubscription.userId);
    });

    it('devrait traiter un callback de paiement échoué', async () => {
      const mockSubscription = {
        id: 'sub123',
        userId: 'user123'
      } as Subscription;

      const callbackData: PayTechCallbackData = {
        paymentId: 'payment123',
        amount: 5000,
        status: 'failed',
        customField: '{}',
        transactionId: 'trans123'
      };

      jest.spyOn(subscriptionService, 'getSubscriptionByPaymentId').mockResolvedValue(mockSubscription);
      jest.spyOn(subscriptionService, 'updateSubscriptionStatus').mockResolvedValue();

      await subscriptionService.handlePaymentCallback(callbackData);

      expect(subscriptionService.updateSubscriptionStatus).toHaveBeenCalledWith(mockSubscription.id, 'inactive');
      expect(mockNotificationService.sendPaymentFailureNotification).toHaveBeenCalledWith(mockSubscription.userId);
    });
  });

  describe('checkSubscriptionStatus', () => {
    it('devrait retourner true pour un abonnement actif et valide', async () => {
      const mockSubscription = {
        id: 'sub123',
        status: 'active',
        endDate: new Date(Date.now() + 24 * 60 * 60 * 1000) // Demain
      } as Subscription;

      jest.spyOn(subscriptionService, 'getSubscription').mockResolvedValue(mockSubscription);

      const result = await subscriptionService.checkSubscriptionStatus('user123');
      expect(result).toBe(true);
    });

    it('devrait retourner false pour un abonnement expiré', async () => {
      const mockSubscription = {
        id: 'sub123',
        status: 'active',
        endDate: new Date(Date.now() - 24 * 60 * 60 * 1000) // Hier
      } as Subscription;

      jest.spyOn(subscriptionService, 'getSubscription').mockResolvedValue(mockSubscription);
      jest.spyOn(subscriptionService, 'updateSubscriptionStatus').mockResolvedValue();

      const result = await subscriptionService.checkSubscriptionStatus('user123');
      expect(result).toBe(false);
      expect(subscriptionService.updateSubscriptionStatus).toHaveBeenCalledWith('sub123', 'inactive');
    });
  });
}); 