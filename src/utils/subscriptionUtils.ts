import { IUser } from '../models/User';
import { AppError } from './appError';

interface Subscription {
  type: 'basic' | 'premium';
  status: 'active' | 'expired' | 'cancelled';
  expiresAt: Date;
  autoRenew: boolean;
}

export const isSubscriptionActive = (user: IUser): boolean => {
  if (!user.subscription) return false;

  const now = new Date();
  return (
    user.subscription.status === 'active' &&
    user.subscription.expiresAt > now
  );
};

export const getSubscriptionDetails = (user: IUser) => {
  if (!user.subscription) {
    return {
      isActive: false,
      type: null,
      status: null,
      expiresAt: null,
      autoRenew: false
    };
  }

  return {
    isActive: isSubscriptionActive(user),
    type: user.subscription.type,
    status: user.subscription.status,
    expiresAt: user.subscription.expiresAt,
    autoRenew: user.subscription.autoRenew
  };
}; 