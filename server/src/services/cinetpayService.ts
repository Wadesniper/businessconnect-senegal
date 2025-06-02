import axios from 'axios';
import { config } from '../config';
import { logger } from '../utils/logger';

interface PaymentData {
  amount: number;
  description: string;
  userId: string;
  customer_name?: string;
  customer_surname?: string;
  customer_email?: string;
  customer_phone_number?: string;
}

export interface PaymentResponse {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'success' | 'failed' | 'ACCEPTED' | 'REFUSED';
  userId: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreatePaymentApiResponse {
  code: string;
  message: string;
  data?: {
    payment_token: string;
    payment_url: string;
    amount: number;
    currency: string;
  };
  api_response_id?: string;
  payment_url?: string;
  link?: string;
  transaction_id?: string;
}

export interface CreatePaymentResult {
  success: boolean;
  message?: string;
  paymentUrl?: string;
  transactionId?: string;
  paymentDetails?: PaymentResponse;
}

class CinetPayService {
  private apiKey: string;
  private siteId: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = config.CINETPAY_APIKEY;
    this.siteId = config.CINETPAY_SITE_ID;
    this.baseUrl = config.CINETPAY_BASE_URL;
  }

  async createPayment(data: PaymentData): Promise<CreatePaymentResult> {
    try {
      const payload = {
        apikey: this.apiKey,
        site_id: this.siteId,
        transaction_id: `BC-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
        amount: data.amount,
        currency: 'XOF',
        description: data.description,
        customer_id: data.userId,
        customer_name: data.customer_name || '',
        customer_surname: data.customer_surname || '',
        customer_email: data.customer_email || '',
        customer_phone_number: data.customer_phone_number || '',
        return_url: config.CINETPAY_RETURN_URL,
        notify_url: config.CINETPAY_NOTIFY_URL,
      };
      
      logger.info('Payload CinetPay pour création de paiement:', payload);
      const response = await axios.post<CreatePaymentApiResponse>(`${this.baseUrl}/payment`, payload);
      logger.info('Réponse CinetPay pour création de paiement:', response.data);

      if (response.data.code === '00' && response.data.data) {
        return {
          success: true,
          paymentUrl: response.data.data.payment_url,
          transactionId: response.data.data.payment_token,
          message: response.data.message,
        };
      } else if (response.data.payment_url && response.data.transaction_id) {
         return {
          success: true,
          paymentUrl: response.data.payment_url,
          transactionId: response.data.transaction_id,
          message: response.data.message || 'Paiement initié',
        };
      } else {
        logger.error('Erreur CinetPay ou format de réponse inattendu:', response.data);
        return {
          success: false,
          message: response.data.message || 'Erreur lors de la création du paiement avec CinetPay.',
        };
      }
    } catch (error: any) {
      logger.error('Erreur AXIOS lors de la création du paiement CinetPay:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la communication avec CinetPay pour créer le paiement');
    }
  }

  async confirmPayment(transactionIdOrToken: string): Promise<PaymentResponse> {
    try {
      const payload = {
        apikey: this.apiKey,
        site_id: this.siteId,
        transaction_id: transactionIdOrToken 
      };
      logger.info('Payload CinetPay pour vérification de paiement:', payload);
      const response = await axios.post(`${this.baseUrl}/payment/checkstatus`, payload);
      logger.info('Réponse CinetPay pour vérification de paiement:', response.data);

      const cinetData = response.data.data || response.data;

      let status: PaymentResponse['status'] = 'pending';
      if (response.data.code === '00' || cinetData.cpm_result === '00') {
        if (cinetData.cpm_trans_status === 'ACCEPTED' || cinetData.status === 'ACCEPTED') {
          status = 'success';
        } else if (['REFUSED', 'FAILED', 'EXPIRED', 'CANCELLED'].includes(cinetData.cpm_trans_status) || ['REFUSED', 'FAILED', 'EXPIRED', 'CANCELLED'].includes(cinetData.status)) {
          status = 'failed';
        }
      } else if (response.data.code && response.data.code !== '00') {
          status = 'failed';
      }

      return {
        id: cinetData.cpm_trans_id || transactionIdOrToken,
        amount: parseFloat(cinetData.cpm_amount || cinetData.amount || 0),
        currency: cinetData.cpm_currency || cinetData.currency || 'XOF',
        status,
        userId: cinetData.cpm_custom || cinetData.customer_id || '',
        description: cinetData.cpm_designation || cinetData.description || '',
        createdAt: new Date(cinetData.cpm_payment_date || cinetData.created_at || Date.now()),
        updatedAt: new Date()
      };
    } catch (error: any) {
      logger.error('Erreur AXIOS lors de la vérification du paiement CinetPay:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la vérification du paiement avec CinetPay');
    }
  }

  async getPaymentHistory(userId: string): Promise<PaymentResponse[]> {
    try {
      const response = await axios.get(`${this.baseUrl}/transactions`, {
        params: {
          apikey: this.apiKey,
          site_id: this.siteId,
          customer_id: userId 
        }
      });

      return response.data.transactions?.map((payment: any) => ({
        id: payment.transaction_id || payment.cpm_trans_id,
        amount: parseFloat(payment.amount || payment.cpm_amount),
        currency: payment.currency || payment.cpm_currency,
        status: (payment.status === 'ACCEPTED' || payment.cpm_trans_status === 'ACCEPTED') ? 'success' : 'failed',
        userId: payment.customer_id || payment.cpm_custom,
        description: payment.description || payment.cpm_designation,
        createdAt: new Date(payment.created_at || payment.cpm_payment_date),
        updatedAt: new Date(payment.updated_at || Date.now())
      })) || [];
    } catch (error: any) {
      logger.error('Erreur lors de la récupération de l\'historique CinetPay:', error.response?.data || error.message);
      return []; 
    }
  }

  async getPaymentDetails(paymentId: string): Promise<PaymentResponse | null> {
    try {
      const payload = {
        apikey: this.apiKey,
        site_id: this.siteId,
        transaction_id: paymentId
      };
      const response = await axios.post(`${this.baseUrl}/payment/checkstatus`, payload);
      
      const cinetData = response.data.data || response.data;

      if (response.data.code !== '00' && response.data.code !== '601') {
         logger.warn('CinetPay checkstatus a retourné un code inattendu:', response.data);
      }
      
      if (response.data.code === '601') {
        return null;
      }

      let status: PaymentResponse['status'] = 'pending';
      if (response.data.code === '00' || cinetData.cpm_result === '00') {
        if (cinetData.cpm_trans_status === 'ACCEPTED' || cinetData.status === 'ACCEPTED') {
          status = 'success';
        } else if (['REFUSED', 'FAILED', 'EXPIRED', 'CANCELLED'].includes(cinetData.cpm_trans_status) || ['REFUSED', 'FAILED', 'EXPIRED', 'CANCELLED'].includes(cinetData.status)) {
          status = 'failed';
        }
      } else {
          status = 'failed';
      }

      return {
        id: cinetData.cpm_trans_id || paymentId,
        amount: parseFloat(cinetData.cpm_amount || cinetData.amount || 0),
        currency: cinetData.cpm_currency || cinetData.currency || 'XOF',
        status,
        userId: cinetData.cpm_custom || cinetData.customer_id || '',
        description: cinetData.cpm_designation || cinetData.description || '',
        createdAt: new Date(cinetData.cpm_payment_date || cinetData.created_at || Date.now()),
        updatedAt: new Date()
      };
    } catch (error: any) {
      logger.error('Erreur AXIOS lors de la récupération des détails CinetPay:', error.response?.data || error.message);
      if (error.response?.status === 404 || error.response?.data?.code === '601') {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Erreur lors de la récupération des détails du paiement');
    }
  }
}

export const cinetpayService = new CinetPayService(); 