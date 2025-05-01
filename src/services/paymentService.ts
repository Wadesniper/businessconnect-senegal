import axios from 'axios';
import { config } from '../config';
import { AppError } from '../utils/errors';
import { logger } from '../utils/logger';

interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentUrl: string;
  metadata?: Record<string, any>;
}

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  metadata?: Record<string, any>;
}

export class PaymentService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    if (!config.paytech.apiKey) {
      throw new Error('PAYTECH_API_KEY non configurée');
    }
    this.apiKey = config.paytech.apiKey;
    this.baseUrl = config.paytech.baseUrl;
  }

  async createPayment(data: PaymentRequest): Promise<PaymentIntent> {
    try {
      if (!data.amount || data.amount <= 0) {
        throw new AppError('Montant invalide', 400);
      }

      if (!data.currency) {
        throw new AppError('Devise requise', 400);
      }

      const response = await axios.post(
        `${this.baseUrl}/api/payment/init`,
        {
          amount: data.amount,
          currency: data.currency,
          description: data.description || 'Paiement BusinessConnect',
          metadata: data.metadata || {}
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (!response.data.token || !response.data.redirect_url) {
        throw new AppError('Réponse PayTech invalide', 500);
      }

      return {
        id: response.data.token,
        amount: data.amount,
        currency: data.currency,
        status: 'pending',
        paymentUrl: response.data.redirect_url,
        metadata: data.metadata
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('Erreur PayTech:', error.response?.data);
        throw new AppError(
          error.response?.data?.message || 'Erreur lors de la création du paiement',
          error.response?.status || 500
        );
      }
      throw error;
    }
  }

  async verifyPayment(paymentId: string): Promise<{ success: boolean; data?: any }> {
    try {
      if (!paymentId) {
        throw new AppError('ID de paiement requis', 400);
      }

      const response = await axios.get(
        `${this.baseUrl}/api/payment/verify/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`
          }
        }
      );

      return {
        success: response.data.status === 'completed',
        data: response.data
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('Erreur de vérification PayTech:', error.response?.data);
        return { success: false };
      }
      throw error;
    }
  }

  async refundPayment(paymentId: string, amount?: number): Promise<boolean> {
    try {
      if (!paymentId) {
        throw new AppError('ID de paiement requis', 400);
      }

      if (amount !== undefined && amount <= 0) {
        throw new AppError('Montant de remboursement invalide', 400);
      }

      await axios.post(
        `${this.baseUrl}/api/payment/refund/${paymentId}`,
        { amount },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return true;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error('Erreur de remboursement PayTech:', error.response?.data);
        throw new AppError(
          error.response?.data?.message || 'Erreur lors du remboursement',
          error.response?.status || 500
        );
      }
      throw error;
    }
  }
} 