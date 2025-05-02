"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const globals_1 = require("@jest/globals");
const subscriptionService_1 = require("../services/subscriptionService");
const subscription_1 = require("../models/subscription");
const User_1 = require("../models/User");
const errors_1 = require("../utils/errors");
const mongoose_1 = __importDefault(require("mongoose"));
globals_1.jest.mock('../models/subscription');
globals_1.jest.mock('../models/User');
globals_1.jest.mock('../config/paytech');
(0, globals_1.describe)('SubscriptionService', () => {
    let subscriptionService;
    const mockUserId = new mongoose_1.default.Types.ObjectId().toString();
    const mockPlanId = 'premium';
    (0, globals_1.beforeEach)(() => {
        subscriptionService = new subscriptionService_1.SubscriptionService();
        globals_1.jest.clearAllMocks();
    });
    (0, globals_1.describe)('createSubscription', () => {
        (0, globals_1.it)('devrait créer un nouvel abonnement', async () => {
            const mockUser = { _id: mockUserId };
            const mockSubscription = {
                userId: mockUserId,
                planId: mockPlanId,
                status: subscriptionService_1.SubscriptionStatus.PENDING
            };
            User_1.User.findById.mockResolvedValue(mockUser);
            subscription_1.Subscription.create.mockResolvedValue(mockSubscription);
            const result = await subscriptionService.createSubscription(mockUserId, mockPlanId);
            (0, globals_1.expect)(User_1.User.findById).toHaveBeenCalledWith(mockUserId);
            (0, globals_1.expect)(subscription_1.Subscription.create).toHaveBeenCalled();
            (0, globals_1.expect)(result).toEqual(mockSubscription);
        });
        (0, globals_1.it)('devrait lever une erreur si l\'utilisateur n\'existe pas', async () => {
            User_1.User.findById.mockResolvedValue(null);
            await (0, globals_1.expect)(subscriptionService.createSubscription(mockUserId, mockPlanId))
                .rejects
                .toThrow(errors_1.AppError);
        });
        (0, globals_1.it)('should create a subscription', async () => {
            const subscriptionData = {
                userId: '123',
                type: 'premium',
                status: 'active',
                startDate: new Date(),
                expiresAt: new Date(),
                autoRenew: true
            };
            const result = await subscriptionService.createSubscription(subscriptionData);
            (0, globals_1.expect)(result).toBeDefined();
            (0, globals_1.expect)(result.userId).toBe(subscriptionData.userId);
        });
    });
    (0, globals_1.describe)('getSubscription', () => {
        (0, globals_1.it)('devrait retourner l\'abonnement le plus récent', async () => {
            const mockSubscription = {
                userId: mockUserId,
                planId: mockPlanId
            };
            const mockQuery = {
                sort: globals_1.jest.fn().mockResolvedValue(mockSubscription)
            };
            subscription_1.Subscription.findOne.mockReturnValue(mockQuery);
            const result = await subscriptionService.getSubscription(mockUserId);
            (0, globals_1.expect)(subscription_1.Subscription.findOne).toHaveBeenCalledWith({ userId: mockUserId });
            (0, globals_1.expect)(result).toEqual(mockSubscription);
        });
    });
    (0, globals_1.describe)('cancelSubscription', () => {
        (0, globals_1.it)('devrait annuler un abonnement existant', async () => {
            const mockSubscription = {
                _id: new mongoose_1.default.Types.ObjectId().toString(),
                status: subscriptionService_1.SubscriptionStatus.ACTIVE,
                save: globals_1.jest.fn()
            };
            subscription_1.Subscription.findById.mockResolvedValue(mockSubscription);
            const result = await subscriptionService.cancelSubscription(mockSubscription._id);
            (0, globals_1.expect)(subscription_1.Subscription.findById).toHaveBeenCalledWith(mockSubscription._id);
            (0, globals_1.expect)(mockSubscription.status).toBe(subscriptionService_1.SubscriptionStatus.CANCELLED);
            (0, globals_1.expect)(mockSubscription.save).toHaveBeenCalled();
            (0, globals_1.expect)(result).toEqual(mockSubscription);
        });
        (0, globals_1.it)('devrait lever une erreur si l\'abonnement n\'existe pas', async () => {
            subscription_1.Subscription.findById.mockResolvedValue(null);
            const subscriptionId = new mongoose_1.default.Types.ObjectId().toString();
            await (0, globals_1.expect)(subscriptionService.cancelSubscription(subscriptionId))
                .rejects
                .toThrow(errors_1.AppError);
        });
    });
});
//# sourceMappingURL=subscription.test.js.map