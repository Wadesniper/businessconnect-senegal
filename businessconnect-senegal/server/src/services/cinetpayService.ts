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
      return_url: config.CINETPAY_RETURN_URL,
      notify_url: config.CINETPAY_NOTIFY_URL,
      customer_name: params.customer_name,
      customer_surname: params.customer_surname,
      customer_email: params.customer_email,
      customer_phone_number: params.customer_phone_number,
      channels: 'ALL',
      metadata: '{}',
    };
    const response = await axios.post(
      config.CINETPAY_BASE_URL,
      body,
      { headers: { 'Content-Type': 'application/json' } }
    );
    if (response.data && response.data.data && response.data.data.payment_url) {
      return {
        payment_url: response.data.data.payment_url,
        transaction_id,
      };
    } else {
      throw new Error('Erreur lors de la génération du lien de paiement CinetPay');
    }
  }
}

export const cinetpayService = new CinetpayService(); 