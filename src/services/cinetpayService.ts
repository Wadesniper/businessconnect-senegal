import axios, { AxiosResponse } from 'axios';
import { config } from '../config';
import { AppError } from '../utils/appError';
import { logger } from '../utils/logger';

interface CinetPayResponse {
  code: string;
  message: string;
  description: string;
  data: {
    payment_token: string;
    payment_url: string;
  };
}

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  return_url: string;
  cancel_url: string;
  trans_id: string;
  customer_name: string;
  customer_email: string;
}

interface PaymentResponse {
  success: boolean;
  payment_url?: string;
  message?: string;
}

interface CinetPayPaymentData {
  amount: number;
  customer_name: string;
  customer_surname: string;
  customer_email: string;
  customer_phone_number: string;
  description: string;
}

export class CinetPayService {
  private apiKey: string;
  private apiUrl: string;
  private siteId: string;

  constructor() {
    this.apiKey = config.CINETPAY_APIKEY;
    this.siteId = config.CINETPAY_SITE_ID;
    this.apiUrl = config.CINETPAY_BASE_URL;
  }

  async createPayment(paymentData: PaymentData): Promise<PaymentResponse> {
    try {
      const response: AxiosResponse<CinetPayResponse> = await axios.post(
        this.apiUrl,
        {
          apikey: this.apiKey,
          site_id: this.siteId,
          transaction_id: paymentData.trans_id,
          amount: paymentData.amount,
          currency: paymentData.currency,
          description: paymentData.description,
          return_url: paymentData.return_url,
          cancel_url: paymentData.cancel_url,
          notify_url: config.CINETPAY_NOTIFY_URL,
          customer_name: paymentData.customer_name,
          customer_email: paymentData.customer_email,
          channels: 'ALL',
          lang: 'fr',
          metadata: 'subscription'
        }
      );

      if (response.data?.data?.payment_url) {
        return {
          success: true,
          payment_url: response.data.data.payment_url
        };
      }

      return {
        success: false,
        message: response.data.message || 'URL de paiement non disponible'
      };
    } catch (error) {
      console.error('Erreur CinetPay:', error);
      return {
        success: false,
        message: 'Erreur lors de la création du paiement'
      };
    }
  }

  async initializePayment(paymentData: CinetPayPaymentData) {
    try {
      // TODO: Implémenter l'intégration CinetPay
      return {
        transaction_id: `TRANS_${Date.now()}`,
        payment_url: `https://checkout.cinetpay.com/${Date.now()}`
      };
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation du paiement CinetPay:', error);
      throw new AppError('Erreur lors de l\'initialisation du paiement', 500);
    }
  }
} 