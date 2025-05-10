import { Subscription } from '../models/subscription';

export class SubscriptionService {
  public async getCurrentSubscription(userId: string) {
    try {
      const subscription = await Subscription.findOne({ 
        userId,
        endDate: { $gt: new Date() }
      }).sort({ endDate: -1 });
      
      return subscription;
    } catch (error) {
      throw new Error('Erreur lors de la récupération de l\'abonnement');
    }
  }
} 