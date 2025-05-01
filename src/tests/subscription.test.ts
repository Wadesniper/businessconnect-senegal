import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { SubscriptionService, SubscriptionStatus } from '../services/subscriptionService';
import { Subscription } from '../models/subscription';
import { User } from '../models/User';
import { AppError } from '../utils/errors';
import mongoose from 'mongoose';

jest.mock('../models/subscription');
jest.mock('../models/User');
jest.mock('../config/paytech');

describe('SubscriptionService', () => {
  let subscriptionService: SubscriptionService;
  const mockUserId = new mongoose.Types.ObjectId().toString();
  const mockPlanId = 'premium';

  beforeEach(() => {
    subscriptionService = new SubscriptionService();
    jest.clearAllMocks();
  });

  describe('createSubscription', () => {
    it('devrait créer un nouvel abonnement', async () => {
      const mockUser = { _id: mockUserId };
      const mockSubscription = {
        userId: mockUserId,
        planId: mockPlanId,
        status: SubscriptionStatus.PENDING
      };

      (User.findById as jest.Mock).mockResolvedValue(mockUser);
      (Subscription.create as jest.Mock).mockResolvedValue(mockSubscription);

      const result = await subscriptionService.createSubscription(mockUserId, mockPlanId);

      expect(User.findById).toHaveBeenCalledWith(mockUserId);
      expect(Subscription.create).toHaveBeenCalled();
      expect(result).toEqual(mockSubscription);
    });

    it('devrait lever une erreur si l\'utilisateur n\'existe pas', async () => {
      (User.findById as jest.Mock).mockResolvedValue(null);

      await expect(subscriptionService.createSubscription(mockUserId, mockPlanId))
        .rejects
        .toThrow(AppError);
    });
  });

  describe('getSubscription', () => {
    it('devrait retourner l\'abonnement le plus récent', async () => {
      const mockSubscription = {
        userId: mockUserId,
        planId: mockPlanId
      };

      const mockQuery = {
        sort: jest.fn().mockResolvedValue(mockSubscription)
      };

      (Subscription.findOne as jest.Mock).mockReturnValue(mockQuery);

      const result = await subscriptionService.getSubscription(mockUserId);

      expect(Subscription.findOne).toHaveBeenCalledWith({ userId: mockUserId });
      expect(result).toEqual(mockSubscription);
    });
  });

  describe('cancelSubscription', () => {
    it('devrait annuler un abonnement existant', async () => {
      const mockSubscription = {
        _id: new mongoose.Types.ObjectId().toString(),
        status: SubscriptionStatus.ACTIVE,
        save: jest.fn()
      };

      (Subscription.findById as jest.Mock).mockResolvedValue(mockSubscription);

      const result = await subscriptionService.cancelSubscription(mockSubscription._id);

      expect(Subscription.findById).toHaveBeenCalledWith(mockSubscription._id);
      expect(mockSubscription.status).toBe(SubscriptionStatus.CANCELLED);
      expect(mockSubscription.save).toHaveBeenCalled();
      expect(result).toEqual(mockSubscription);
    });

    it('devrait lever une erreur si l\'abonnement n\'existe pas', async () => {
      (Subscription.findById as jest.Mock).mockResolvedValue(null);

      const subscriptionId = new mongoose.Types.ObjectId().toString();
      await expect(subscriptionService.cancelSubscription(subscriptionId))
        .rejects
        .toThrow(AppError);
    });
  });
}); 