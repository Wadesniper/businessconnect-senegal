import { describe, expect, it, beforeEach } from '@jest/globals';
import { SubscriptionService } from '../services/subscriptionService';
import { Subscription, SubscriptionStatus, SubscriptionType } from '../types/subscription';

describe('SubscriptionService', () => {
  let subscriptionService: SubscriptionService;

  beforeEach(() => {
    subscriptionService = new SubscriptionService();
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
    it('devrait initier un paiement pour une nouvelle souscription', async () => {
      const userId = '123';
      const type: SubscriptionType = 'etudiant';

      const paymentInitiation = await subscriptionService.initiatePayment(userId, type);

      expect(paymentInitiation).toBeDefined();
      expect(paymentInitiation.paymentId).toBeDefined();
      expect(paymentInitiation.redirectUrl).toBeDefined();
      expect(paymentInitiation.redirectUrl).toContain('test-payment.paytech.sn');
    });

    it('devrait rejeter le paiement si l\'utilisateur a déjà un abonnement actif', async () => {
      const userId = '123';
      const type: SubscriptionType = 'etudiant';

      await subscriptionService.createSubscription(userId, type);
      await subscriptionService.updateSubscriptionStatus(userId, 'active');

      await expect(subscriptionService.initiatePayment(userId, type))
        .rejects
        .toThrow('Utilisateur a déjà un abonnement actif');
    });
  });

  describe('handlePaymentCallback', () => {
    it('devrait activer l\'abonnement après un paiement réussi', async () => {
      const userId = '123';
      const type: SubscriptionType = 'etudiant';
      const transactionId = 'TRANS123';

      await subscriptionService.createSubscription(userId, type);
      const paymentData = {
        customField: JSON.stringify({ userId, subscriptionType: type }),
        transactionId,
        status: 'completed'
      };

      const updatedSubscription = await subscriptionService.handlePaymentCallback(paymentData);

      expect(updatedSubscription.status).toBe('active');
      expect(updatedSubscription.transactionId).toBe(transactionId);
      expect(updatedSubscription.endDate).toBeInstanceOf(Date);
    });

    it('devrait marquer l\'abonnement comme expiré si le paiement échoue', async () => {
      const userId = '123';
      const type: SubscriptionType = 'etudiant';

      await subscriptionService.createSubscription(userId, type);
      const paymentData = {
        customField: JSON.stringify({ userId, subscriptionType: type }),
        transactionId: 'FAILED123',
        status: 'failed'
      };

      const updatedSubscription = await subscriptionService.handlePaymentCallback(paymentData);

      expect(updatedSubscription.status).toBe('expired');
    });
  });

  describe('checkSubscriptionStatus', () => {
    it('devrait retourner true pour un abonnement actif et valide', async () => {
      const userId = '123';
      const type: SubscriptionType = 'etudiant';

      await subscriptionService.createSubscription(userId, type);
      await subscriptionService.updateSubscriptionStatus(userId, 'active');

      const isValid = await subscriptionService.checkSubscriptionStatus(userId);
      expect(isValid).toBe(true);
    });

    it('devrait retourner false pour un abonnement expiré', async () => {
      const userId = '123';
      const type: SubscriptionType = 'etudiant';

      const subscription = await subscriptionService.createSubscription(userId, type);
      subscription.endDate = new Date(Date.now() - 24 * 60 * 60 * 1000); // Hier
      await subscriptionService.updateSubscriptionStatus(userId, 'active');

      const isValid = await subscriptionService.checkSubscriptionStatus(userId);
      expect(isValid).toBe(false);
    });
  });
}); 