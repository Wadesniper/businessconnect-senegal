import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';

interface InitPaymentParams {
  amount: number;
  transaction_id?: string;
  currency?: string;
  customer_name: string;
  customer_surname: string;
  customer_email: string;
  customer_phone_number: string;
  description?: string;
  customer_address?: string;
  customer_city?: string;
  customer_country?: string;
  customer_state?: string;
  customer_zip_code?: string;
}

export class CinetpayService {
  async initializePayment(params: InitPaymentParams) {
    const transaction_id = params.transaction_id || uuidv4();
    const body = {
      apikey: config.CINETPAY_APIKEY,
      site_id: config.CINETPAY_SITE_ID,
      transaction_id,
      amount: params.amount,
      currency: params.currency || 'XOF',
      description: params.description || 'Abonnement BusinessConnect',
      return_url: config.CINETPAY_RETURN_URL || `${config.CLIENT_URL}/payment/return`,
      notify_url: config.CINETPAY_NOTIFY_URL || `${config.API_URL}/api/subscriptions/notify`,
      customer_name: params.customer_name,
      customer_surname: params.customer_surname,
      customer_email: params.customer_email,
      customer_phone_number: params.customer_phone_number,
      customer_address: params.customer_address || 'Dakar',
      customer_city: params.customer_city || 'Dakar',
      customer_country: params.customer_country || 'SN',
      customer_state: params.customer_state || 'DK',
      customer_zip_code: params.customer_zip_code || '12000',
      channels: 'ALL',
      metadata: '{}',
    };

    try {
      const response = await axios.post(
        config.CINETPAY_BASE_URL,
        body,
        { 
          headers: { 
            'Content-Type': 'application/json',
            'User-Agent': 'BusinessConnect-Senegal/1.0'
          } 
        }
      );

      if (response.data?.data?.payment_url) {
        return {
          payment_url: response.data.data.payment_url,
          transaction_id,
        };
      } else {
        throw new Error('Erreur lors de la génération du lien de paiement CinetPay');
      }
    } catch (error: any) {
      if (error.response?.data) {
        throw new Error(`Erreur CinetPay: ${error.response.data.message || error.response.data.error}`);
      }
      throw error;
    }
  }
}

export const cinetpayService = new CinetpayService(); 