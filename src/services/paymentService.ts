import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';
import { AppError } from '../utils/appError';

export interface CinetPayPaymentResult {
  success: boolean;
  paymentUrl?: string;
  transactionId?: string;
  error?: string;
}

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  metadata: {
    userId: string;
    subscriptionType: string;
  };
}

export class PaymentService {
  private static readonly CINETPAY_BASE_URL = config.CINETPAY_BASE_URL;
  private static readonly CINETPAY_API_KEY = config.CINETPAY_APIKEY;
  private static readonly CINETPAY_SITE_ID = config.CINETPAY_SITE_ID;

  static async initializePayment(
    amount: number,
    currency: string = 'XOF',
    description: string,
    customerId: string
  ): Promise<CinetPayPaymentResult> {
    try {
      const paymentData = {
        apikey: this.CINETPAY_API_KEY,
        site_id: this.CINETPAY_SITE_ID,
        transaction_id: `TR-${Date.now()}-${customerId}`,
        amount,
        currency,
        description,
        customer_id: customerId,
        customer_name: 'Client BusinessConnect',
        notify_url: config.CINETPAY_NOTIFY_URL,
        return_url: config.CINETPAY_RETURN_URL,
        channels: 'ALL',
        metadata: JSON.stringify({ customerId })
      };

      const response = await axios.post(
        `${this.CINETPAY_BASE_URL}/payment`,
        paymentData
      );

      if (response.data.code === '201') {
        return {
          success: true,
          paymentUrl: response.data.data.payment_url,
          transactionId: paymentData.transaction_id
        };
      }

      logger.error('Erreur CinetPay:', response.data);
      return {
        success: false,
        error: 'Erreur lors de l\'initialisation du paiement'
      };
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation du paiement:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'initialisation du paiement'
      };
    }
  }

  static async verifyPayment(transactionId: string): Promise<boolean> {
    try {
      const verificationData = {
        apikey: this.CINETPAY_API_KEY,
        site_id: this.CINETPAY_SITE_ID,
        transaction_id: transactionId
      };

      const response = await axios.post(
        `${this.CINETPAY_BASE_URL}/verify`,
        verificationData
      );

      return response.data.code === '00';
    } catch (error) {
      logger.error('Erreur lors de la vérification du paiement:', error);
      return false;
    }
  }

  async createPayment(data: PaymentData) {
    try {
      // TODO: Implémenter la création du paiement
      return {
        id: `PAY_${Date.now()}`,
        amount: data.amount,
        currency: data.currency,
        status: 'pending',
        paymentUrl: `https://payment.example.com/${Date.now()}`
      };
    } catch (error) {
      logger.error('Erreur lors de la création du paiement:', error);
      throw new AppError('Erreur lors de la création du paiement', 500);
    }
  }
} 