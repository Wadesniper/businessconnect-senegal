import { config } from '../config';
import { logger } from '../utils/logger';
import axios from 'axios';

interface PaymentResponse {
  success: boolean;
  redirectUrl?: string;
  error?: string;
}

export class PaymentService {
  private readonly apiKey: string;
  private readonly webhookSecret: string;
  private readonly baseUrl: string;

  constructor() {
    this.apiKey = config.PAYTECH_API_KEY;
    this.webhookSecret = config.PAYTECH_WEBHOOK_SECRET;
    this.baseUrl = config.PAYTECH_BASE_URL;
  }

  async initializePayment(amount: number, description: string): Promise<PaymentResponse> {
    try {
      const response = await axios.post(`${this.baseUrl}/payment/init`, {
        amount,
        description,
        apiKey: this.apiKey
      });

      if (response.data.success) {
        return {
          success: true,
          redirectUrl: response.data.redirectUrl
        };
      }

      return {
        success: false,
        error: response.data.message || 'Erreur lors de l\'initialisation du paiement'
      };

    } catch (error) {
      logger.error('Erreur lors de l\'initialisation du paiement:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'initialisation du paiement'
      };
    }
  }

  verifyWebhookSignature(signature: string, payload: string): boolean {
    try {
      const hmac = require('crypto')
        .createHmac('sha256', this.webhookSecret)
        .update(payload)
        .digest('hex');
      
      return hmac === signature;
    } catch (error) {
      logger.error('Erreur lors de la vérification de la signature webhook:', error);
      return false;
    }
  }

  async verifyPayment(paymentId: string): Promise<boolean> {
    try {
      const response = await axios.get(`${this.baseUrl}/payment/verify/${paymentId}`, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      return response.data.success === true;
    } catch (error) {
      logger.error('Erreur lors de la vérification du paiement:', error);
      return false;
    }
  }

  async initializeCinetPayPayment(params: {
    amount: number,
    description: string,
    transaction_id: string,
    customer_name: string,
    customer_surname: string,
    customer_email: string,
    customer_phone_number: string,
    customer_address: string,
    customer_city: string,
    customer_country: string,
    customer_state: string,
    customer_zip_code: string,
    metadata?: string
  }) {
    const data = {
      apikey: config.CINETPAY_APIKEY,
      site_id: config.CINETPAY_SITE_ID,
      transaction_id: params.transaction_id,
      amount: params.amount,
      currency: 'XOF',
      description: params.description,
      customer_name: params.customer_name,
      customer_surname: params.customer_surname,
      customer_email: params.customer_email,
      customer_phone_number: params.customer_phone_number,
      customer_address: params.customer_address,
      customer_city: params.customer_city,
      customer_country: params.customer_country,
      customer_state: params.customer_state,
      customer_zip_code: params.customer_zip_code,
      notify_url: config.CINETPAY_NOTIFY_URL,
      return_url: config.CINETPAY_RETURN_URL,
      channels: 'ALL',
      metadata: params.metadata || '',
      lang: 'fr'
    };

    const response = await axios.post(config.CINETPAY_BASE_URL, data, {
      headers: { 'Content-Type': 'application/json' }
    });

    if (response.data.code !== '201') {
      throw new Error(response.data.message || "Erreur lors de l'initialisation du paiement CinetPay");
    }

    return {
      payment_url: response.data.data.payment_url,
      token: response.data.data.token
    };
  }
} 