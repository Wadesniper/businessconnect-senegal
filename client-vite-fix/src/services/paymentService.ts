// Fichier obsolète : toute la logique de paiement passe désormais par le backend (CinetPay). Ce fichier est conservé vide pour éviter les erreurs d'import. 

import { api } from './api';

class PaymentService {
  async verifyPayment(data: { token: string }): Promise<{ success: boolean; message?: string }> {
    try {
      const response = await api.post<{ success: boolean; message?: string }>('/api/subscriptions/verify-payment', data);
      return response.data;
    } catch (error: any) {
      console.error('Erreur lors de la vérification du paiement:', error);
      const message = error.response?.data?.message || 'La vérification du paiement a échoué côté serveur.';
      throw new Error(message);
    }
  }
}

export const paymentService = new PaymentService(); 