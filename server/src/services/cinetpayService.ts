import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { config } from '../config';
import { logger } from '../utils/logger';

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
  private validateConfig() {
    const missingConfig = [];
    if (!config.CINETPAY_APIKEY) missingConfig.push('CINETPAY_APIKEY');
    if (!config.CINETPAY_SITE_ID) missingConfig.push('CINETPAY_SITE_ID');
    if (!config.CINETPAY_BASE_URL) missingConfig.push('CINETPAY_BASE_URL');
    if (!config.CINETPAY_NOTIFY_URL) missingConfig.push('CINETPAY_NOTIFY_URL');
    if (!config.CINETPAY_RETURN_URL) missingConfig.push('CINETPAY_RETURN_URL');

    if (missingConfig.length > 0) {
      throw new Error(`Configuration CinetPay manquante: ${missingConfig.join(', ')}`);
    }
  }

  private validateParams(params: InitPaymentParams) {
    const missingParams = [];
    if (!params.amount || params.amount <= 0) missingParams.push('amount');
    if (!params.customer_name) missingParams.push('customer_name');
    if (!params.customer_surname) missingParams.push('customer_surname');
    if (!params.customer_phone_number) missingParams.push('customer_phone_number');
    if (!params.customer_email) missingParams.push('customer_email');

    if (missingParams.length > 0) {
      throw new Error(`Paramètres requis manquants: ${missingParams.join(', ')}`);
    }
  }

  async initializePayment(params: InitPaymentParams) {
    try {
      this.validateConfig();
      this.validateParams(params);

      const transaction_id = params.transaction_id || uuidv4();

      // Formater le numéro de téléphone
      let phoneNumber = params.customer_phone_number;
      if (!phoneNumber.startsWith('+')) {
        if (phoneNumber.startsWith('7')) {
          phoneNumber = '+221' + phoneNumber;
        }
      }

      const body = {
        apikey: config.CINETPAY_APIKEY,
        site_id: config.CINETPAY_SITE_ID,
        transaction_id,
        amount: params.amount,
        currency: params.currency || 'XOF',
        description: params.description || 'Abonnement BusinessConnect',
        return_url: config.CINETPAY_RETURN_URL,
        notify_url: config.CINETPAY_NOTIFY_URL,
        customer_name: params.customer_name.trim(),
        customer_surname: params.customer_surname.trim(),
        customer_email: params.customer_email.toLowerCase().trim(),
        customer_phone_number: phoneNumber,
        customer_address: params.customer_address || 'Dakar',
        customer_city: params.customer_city || 'Dakar',
        customer_country: params.customer_country || 'SN',
        customer_state: params.customer_state || 'DK',
        customer_zip_code: params.customer_zip_code || '12000',
        channels: 'ALL',
        lang: 'fr',
        metadata: JSON.stringify({
          service: 'BusinessConnect',
          type: 'subscription'
        })
      };

      logger.info('CinetPay - Initialisation du paiement:', {
        transaction_id,
        amount: params.amount,
        customer: {
          name: params.customer_name,
          surname: params.customer_surname,
          phone: phoneNumber
        }
      });

      const response = await axios.post(
        config.CINETPAY_BASE_URL,
        body,
        {
          headers: {
            'Content-Type': 'application/json',
            'User-Agent': 'BusinessConnect-Senegal/1.0'
          },
          timeout: 30000
        }
      );

      if (response.data?.code === '201' && response.data?.data?.payment_url) {
        logger.info('CinetPay - Paiement initialisé avec succès:', {
          transaction_id,
          payment_url: response.data.data.payment_url
        });

        return {
          payment_url: response.data.data.payment_url,
          transaction_id
        };
      }

      throw new Error(response.data?.message || 'URL de paiement non disponible dans la réponse CinetPay');
    } catch (error: any) {
      logger.error('CinetPay - Erreur lors de l\'initialisation du paiement:', {
        error: error.message,
        response: error.response?.data,
        config: {
          hasApiKey: !!config.CINETPAY_APIKEY,
          hasSiteId: !!config.CINETPAY_SITE_ID,
          baseUrl: config.CINETPAY_BASE_URL
        }
      });

      if (error.response?.data) {
        const errorMsg = error.response.data.message || 
                        error.response.data.description || 
                        'Erreur CinetPay inconnue';
        throw new Error(`Erreur CinetPay: ${errorMsg}`);
      }

      if (error.code === 'ECONNABORTED') {
        throw new Error('Le service de paiement ne répond pas. Veuillez réessayer.');
      }

      throw error;
    }
  }
}

export const cinetpayService = new CinetpayService(); 