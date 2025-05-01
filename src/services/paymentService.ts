import { PayTech } from '../config/paytech';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  redirectUrl: string;
}

export class PaymentService {
  private paytech: PayTech;

  constructor() {
    this.paytech = new PayTech();
  }

  async createPaymentIntent(amount: number, description: string): Promise<PaymentIntent> {
    try {
      const response = await this.paytech.createPayment({
        amount,
        description,
        currency: 'XOF'
      });

      if (!response.success) {
        throw new AppError('Échec de la création du paiement', 400);
      }

      return {
        id: response.paymentId,
        amount,
        currency: 'XOF',
        status: 'pending',
        redirectUrl: response.redirectUrl
      };
    } catch (error) {
      logger.error('Erreur lors de la création du paiement:', error);
      throw new AppError('Erreur lors de la création du paiement', 500);
    }
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      const response = await this.paytech.verifyPayment(paymentId);
      return response.status === 'completed';
    } catch (error) {
      logger.error('Erreur lors de la vérification du paiement:', error);
      throw new AppError('Erreur lors de la vérification du paiement', 500);
    }
  }

  async refundPayment(paymentId: string): Promise<boolean> {
    try {
      const response = await this.paytech.refundPayment(paymentId);
      return response.success;
    } catch (error) {
      logger.error('Erreur lors du remboursement:', error);
      throw new AppError('Erreur lors du remboursement', 500);
    }
  }
} 