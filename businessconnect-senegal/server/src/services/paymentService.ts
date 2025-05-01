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
} 