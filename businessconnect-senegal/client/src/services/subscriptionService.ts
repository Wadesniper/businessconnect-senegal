import { Subscription } from '../types/user';
import { localStorageService } from './localStorageService';

class SubscriptionService {
  async getSubscription(userId: string): Promise<Subscription | null> {
    return localStorageService.getUserSubscription(userId);
  }

  async subscribe(userId: string, plan: 'free' | 'premium' | 'enterprise'): Promise<Subscription> {
    const planDetails = {
      free: {
        duration: 30, // jours
        price: 0,
        features: ['basic_search', 'cv_creation'],
      },
      premium: {
        duration: 30,
        price: 15000,
        features: ['advanced_search', 'cv_creation', 'job_alerts', 'priority_support'],
      },
      enterprise: {
        duration: 30,
        price: 50000,
        features: ['unlimited_search', 'cv_creation', 'job_alerts', 'priority_support', 'api_access', 'custom_branding'],
      }
    };

    const newSubscription: Subscription = {
      id: localStorageService.generateId(),
      userId,
      type: plan,
      status: 'active',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + planDetails[plan].duration * 24 * 60 * 60 * 1000).toISOString(),
      autoRenew: false,
      features: planDetails[plan].features,
      price: planDetails[plan].price,
      currency: 'XOF',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    localStorageService.saveSubscription(newSubscription);
    return newSubscription;
  }

  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await this.getSubscription(userId);
    if (!subscription) {
      throw new Error('Aucun abonnement trouvé');
    }

    const updatedSubscription = {
      ...subscription,
      status: 'cancelled',
      autoRenew: false,
      updatedAt: new Date().toISOString()
    };

    localStorageService.saveSubscription(updatedSubscription);
  }

  async renewSubscription(userId: string): Promise<Subscription> {
    const currentSubscription = await this.getSubscription(userId);
    if (!currentSubscription) {
      throw new Error('Aucun abonnement trouvé');
    }

    return this.subscribe(userId, currentSubscription.type);
  }

  hasFeature(subscription: Subscription | null, feature: string): boolean {
    if (!subscription || subscription.status !== 'active') {
      return false;
    }
    return subscription.features.includes(feature);
  }

  isSubscriptionActive(subscription: Subscription | null): boolean {
    if (!subscription) {
      return false;
    }

    return (
      subscription.status === 'active' &&
      new Date(subscription.endDate) > new Date()
    );
  }

  getDaysUntilExpiration(subscription: Subscription | null): number {
    if (!subscription) {
      return 0;
    }

    const endDate = new Date(subscription.endDate);
    const now = new Date();
    const diffTime = endDate.getTime() - now.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
}

export const subscriptionService = new SubscriptionService(); 