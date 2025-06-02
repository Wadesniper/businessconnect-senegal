import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

interface PaymentData {
  amount: number;
  description: string;
  userId: string;
}

interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed';
  userId: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

class CinetPayService {
  private apiKey: string;
  private siteId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.CINETPAY_APIKEY;
    this.siteId = config.CINETPAY_SITE_ID;
    this.baseUrl = config.CINETPAY_BASE_URL;
  }

  async createPayment(data: PaymentData): Promise<PaymentResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/payment`, {
        apikey: this.apiKey,
        site_id: this.siteId,
        amount: data.amount,
        currency: 'XOF',
        description: data.description,
        customer_id: data.userId,
        return_url: config.CINETPAY_RETURN_URL,
        cancel_url: `${config.CLIENT_URL}/payment/cancel`,
        notify_url: config.CINETPAY_NOTIFY_URL
      });

      return {
        id: response.data.payment_token,
        amount: data.amount,
        currency: 'XOF',
        status: 'pending',
        userId: data.userId,
        description: data.description,
        createdAt: new Date(),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Erreur lors de la création du paiement CinetPay:', error);
      throw new Error('Erreur lors de la création du paiement');
    }
  }

  async confirmPayment(token: string): Promise<PaymentResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/payment/check`, {
        apikey: this.apiKey,
        site_id: this.siteId,
        payment_token: token
      });

      return {
        id: token,
        amount: response.data.amount,
        currency: response.data.currency,
        status: response.data.status === 'ACCEPTED' ? 'success' : 'failed',
        userId: response.data.customer_id,
        description: response.data.description,
        createdAt: new Date(response.data.created_at),
        updatedAt: new Date()
      };
    } catch (error) {
      logger.error('Erreur lors de la vérification du paiement CinetPay:', error);
      throw new Error('Erreur lors de la vérification du paiement');
    }
  }

  async getPaymentHistory(userId: string): Promise<PaymentResponse[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/payments`, {
        params: {
          apikey: this.apiKey,
          site_id: this.siteId,
          customer_id: userId
        }
      });

      return response.data.payments.map((payment: any) => ({
        id: payment.payment_token,
        amount: payment.amount,
        currency: payment.currency,
        status: payment.status === 'ACCEPTED' ? 'success' : 'failed',
        userId: payment.customer_id,
        description: payment.description,
        createdAt: new Date(payment.created_at),
        updatedAt: new Date(payment.updated_at)
      }));
    } catch (error) {
      logger.error('Erreur lors de la récupération de l\'historique CinetPay:', error);
      throw new Error('Erreur lors de la récupération de l\'historique');
    }
  }

  async getPaymentDetails(paymentId: string): Promise<PaymentResponse | null> {
    try {
      const response = await axios.get(`${this.baseUrl}/payment/${paymentId}`, {
        params: {
          apikey: this.apiKey,
          site_id: this.siteId
        }
      });

      if (!response.data) {
        return null;
      }

      return {
        id: paymentId,
        amount: response.data.amount,
        currency: response.data.currency,
        status: response.data.status === 'ACCEPTED' ? 'success' : 'failed',
        userId: response.data.customer_id,
        description: response.data.description,
        createdAt: new Date(response.data.created_at),
        updatedAt: new Date(response.data.updated_at)
      };
    } catch (error) {
      logger.error('Erreur lors de la récupération des détails CinetPay:', error);
      throw new Error('Erreur lors de la récupération des détails');
    }
  }
}

export const cinetpayService = new CinetPayService(); 