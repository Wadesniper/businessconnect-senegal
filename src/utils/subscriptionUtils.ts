import { User } from '../models/User';
import { AppError } from './appError';

export const checkSubscription = async (userId: string): Promise<boolean> => {
  const user = await User.findById(userId);
  if (!user) {
    return false;
  }

  if (!user.subscription) {
    return false;
  }

  const now = new Date();
  return user.subscription.status === 'active' &&
    user.subscription.endDate > now;
};

export const getSubscriptionDetails = async (userId: string) => {
  const user = await User.findById(userId);
  if (!user || !user.subscription) {
    return null;
  }

  return {
    status: user.subscription.status,
    type: user.subscription.type,
    startDate: user.subscription.startDate,
    endDate: user.subscription.endDate,
    autoRenew: user.subscription.autoRenew
  };
}; 