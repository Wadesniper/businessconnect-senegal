import { User } from '../models/User';
import { AppError } from './appError';

export const checkSubscription = async (userId: string): Promise<boolean> => {
  const user = await User.findById(userId);
  if (!user) {
    throw new AppError('Utilisateur non trouvé', 404);
  }

  if (!user.subscription) {
    return false;
  }

  const now = new Date();
  return user.subscription.status === 'active' && 
         user.subscription.expiresAt > now;
}; 