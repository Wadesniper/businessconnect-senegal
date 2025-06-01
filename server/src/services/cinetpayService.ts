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
    
    // Validation du montant (doit être un multiple de 5 selon la doc CinetPay)
    if (params.amount % 5 !== 0) {
      throw new Error('Le montant doit être un multiple de 5');
    }

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
      lang: 'fr',
      metadata: JSON.stringify({
        service: 'BusinessConnect',
        type: 'subscription'
      })
    };

    try {
      console.log('Envoi requête CinetPay:', {
        url: config.CINETPAY_BASE_URL,
        transaction_id,
        amount: params.amount
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

      console.log('Réponse CinetPay:', response.data);

      if (response.data?.data?.payment_url) {
        return {
          payment_url: response.data.data.payment_url,
          transaction_id,
        };
      } else {
        console.error('Réponse CinetPay incomplète:', response.data);
        throw new Error('URL de paiement non disponible dans la réponse CinetPay');
      }
    } catch (error: any) {
      console.error('Erreur complète CinetPay:', error);
      
      if (error.response?.data) {
        console.error('Détails erreur CinetPay:', error.response.data);
        const errorMsg = error.response.data.message || 
                        error.response.data.description || 
                        'Erreur CinetPay inconnue';
        throw new Error(`CinetPay Error: ${errorMsg}`);
      }
      
      if (error.code === 'ECONNABORTED') {
        throw new Error('Timeout lors de la connexion à CinetPay');
      }
      
      throw new Error(`Erreur technique CinetPay: ${error.message}`);
    }
  }
}

export const cinetpayService = new CinetpayService(); 