import { Subscription } from '../types/user';
import { api } from './api';

export const subscriptionService = {
  async getSubscription(userId: string): Promise<Subscription | null> {
    try {
      const response = await api.get(`/api/subscriptions/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'abonnement:', error);
      return null;
    }
  },

  async updateSubscription(userId: string, subscription: Partial<Subscription>): Promise<Subscription | null> {
    try {
      const response = await api.put(`/api/subscriptions/${userId}`, subscription);
      return response.data;
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'abonnement:', error);
      return null;
    }
  },

  async checkSubscriptionStatus(userId: string): Promise<boolean> {
    try {
      const response = await api.get(`/api/subscriptions/${userId}/status`);
      return response.data.isValid;
    } catch (error) {
      console.error('Erreur lors de la vérification du statut de l\'abonnement:', error);
      return false;
    }
  }
}; 