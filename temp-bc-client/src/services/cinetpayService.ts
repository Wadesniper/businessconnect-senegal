import axios from 'axios';
import { CinetPayConfig } from '../config/cinetpay';

interface PaymentData {
  amount: number;
  currency: string;
  description: string;
  customer_name?: string;
  customer_surname?: string;
  customer_email?: string;
  customer_phone_number?: string;
  customer_address?: string;
  channels: string;
  metadata?: string;
}

export class CinetPayService {
  private static readonly BASE_URL = 'https://api-checkout.cinetpay.com/v2/payment';

  static async initiatePayment(data: PaymentData) {
    try {
      const response = await axios.post(this.BASE_URL, {
        apikey: CinetPayConfig.apiKey,
        site_id: CinetPayConfig.siteId,
        transaction_id: `BC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        amount: data.amount,
        currency: data.currency || 'XOF',
        description: data.description,
        customer_name: data.customer_name,
        customer_surname: data.customer_surname,
        customer_email: data.customer_email,
        customer_phone_number: data.customer_phone_number,
        customer_address: data.customer_address,
        channels: data.channels || 'ALL',
        notify_url: CinetPayConfig.notifyUrl,
        return_url: CinetPayConfig.returnUrl,
        cancel_url: CinetPayConfig.cancelUrl,
        lang: 'fr',
        metadata: data.metadata
      });

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erreur CinetPay:', error);
      return {
        success: false,
        error: 'Erreur lors de l\'initiation du paiement'
      };
    }
  }

  static async verifyPayment(transactionId: string) {
    try {
      const response = await axios.post(
        'https://api-checkout.cinetpay.com/v2/payment/check',
        {
          apikey: CinetPayConfig.apiKey,
          site_id: CinetPayConfig.siteId,
          transaction_id: transactionId
        }
      );

      return {
        success: true,
        data: response.data
      };
    } catch (error) {
      console.error('Erreur vérification CinetPay:', error);
      return {
        success: false,
        error: 'Erreur lors de la vérification du paiement'
      };
    }
  }
} 