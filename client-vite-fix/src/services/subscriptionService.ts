import type { Subscription } from '../types/user';
import { api } from './api';

// Générateur d'UUID compatible navigateur/Node
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

class SubscriptionService {
  async getSubscription(userId: string): Promise<Subscription | null> {
    // Pour l'instant, on retourne null car les abonnements sont gérés côté serveur
    return null;
  }

  async subscribe(userId: string, plan: 'etudiant' | 'annonceur' | 'employeur'): Promise<Subscription> {
    const planDetails = {
      etudiant: {
        duration: 30, // jours
        price: 1000,
        features: ['cv', 'offres_emploi', 'candidatures', 'forum', 'formations'],
      },
      annonceur: {
        duration: 30,
        price: 5000,
        features: ['publication_annonces', 'promotion', 'statistiques', 'support_prioritaire'],
      },
      employeur: {
        duration: 30,
        price: 9000,
        features: ['publication_illimitee', 'cvtheque', 'gestion_candidatures', 'outils_rh'],
      }
    };

    const newSubscription: Subscription = {
      id: uuidv4(),
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

    // TODO: Sauvegarder côté serveur via API
    return newSubscription;
  }

  async cancelSubscription(userId: string): Promise<void> {
    const subscription = await this.getSubscription(userId);
    if (!subscription) {
      throw new Error('Aucun abonnement trouvé');
    }

    // TODO: Annuler côté serveur via API
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

  async fetchSubscriptionStatus(userId: string): Promise<boolean> {
    try {
      const res = await api.get<{ isActive: boolean }>(`/subscriptions/${userId}/status`);
      return res.data.isActive;
    } catch (error: any) {
      // Si c'est une erreur 404, c'est normal (pas d'abonnement), donc on ne signale pas d'erreur
      if (error.response?.status === 404) {
        return false;
      }
      
      // Pour les autres erreurs, on log mais on retourne false silencieusement
      console.warn('Erreur lors de la vérification du statut d\'abonnement:', error.message);
      return false;
    }
  }
}

export const subscriptionService = new SubscriptionService(); 