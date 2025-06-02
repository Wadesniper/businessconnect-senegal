import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

interface CinetPayParams {
  amount: number;
  customer_name: string;
  customer_surname: string;
  customer_email: string;
  customer_phone_number: string;
  description: string;
}

interface CinetPayResponse {
  code: string;
  message: string;
  data?: {
    payment_token: string;
    payment_url: string;
  };
}

interface CinetPayResult {
  success: boolean;
  message?: string;
  payment_url?: string;
  transaction_id?: string;
}

export class CinetPayService {
  private validateConfig() {
    const missingConfig: string[] = [];

    if (!config.CINETPAY_APIKEY) missingConfig.push('CINETPAY_APIKEY');
    if (!config.CINETPAY_SITE_ID) missingConfig.push('CINETPAY_SITE_ID');
    if (!config.CINETPAY_BASE_URL) missingConfig.push('CINETPAY_BASE_URL');
    if (!config.CINETPAY_NOTIFY_URL) missingConfig.push('CINETPAY_NOTIFY_URL');
    if (!config.CINETPAY_RETURN_URL) missingConfig.push('CINETPAY_RETURN_URL');

    if (missingConfig.length > 0) {
      throw new Error(`Configuration CinetPay manquante : ${missingConfig.join(', ')}`);
    }
  }

  private validateParams(params: CinetPayParams) {
    const missingParams: string[] = [];

    if (!params.amount || params.amount <= 0) missingParams.push('amount');
    if (!params.customer_name) missingParams.push('customer_name');
    if (!params.customer_surname) missingParams.push('customer_surname');
    if (!params.customer_phone_number) missingParams.push('customer_phone_number');
    if (!params.customer_email) missingParams.push('customer_email');

    if (missingParams.length > 0) {
      throw new Error(`Paramètres manquants : ${missingParams.join(', ')}`);
    }
  }

  async initializePayment(params: CinetPayParams): Promise<CinetPayResult> {
    try {
      this.validateConfig();
      this.validateParams(params);

      const transaction_id = `TRANS_${Date.now()}`;

      const paymentData = {
        apikey: config.CINETPAY_APIKEY,
        site_id: config.CINETPAY_SITE_ID,
        transaction_id,
        amount: params.amount,
        currency: 'XOF',
        description: params.description,
        customer_name: params.customer_name,
        customer_surname: params.customer_surname,
        customer_email: params.customer_email,
        customer_phone_number: params.customer_phone_number,
        notify_url: config.CINETPAY_NOTIFY_URL,
        return_url: config.CINETPAY_RETURN_URL,
        channels: 'ALL',
        metadata: 'subscription_payment'
      };

      const response = await axios.post<CinetPayResponse>(
        `${config.CINETPAY_BASE_URL}/payment`,
        paymentData
      );

      if (response.data?.data?.payment_url) {
        return {
          success: true,
          payment_url: response.data.data.payment_url,
          transaction_id
        };
      }

      logger.error('Erreur CinetPay:', response.data);
      return {
        success: false,
        message: response.data.message || 'Erreur lors de l\'initialisation du paiement'
      };
    } catch (error) {
      logger.error('Erreur lors de l\'initialisation du paiement CinetPay:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Erreur inconnue'
      };
    }
  }
}

export const cinetpayService = new CinetPayService(); 