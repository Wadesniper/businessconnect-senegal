import axios from 'axios';
import { config } from '../config.js';
import { logger } from '../utils/logger.js';

export interface PaytechPaymentParams {
  item_name: string;
  item_price: number;
  ref_command: string;
  command_name: string;
  custom_field: any;
}

export interface PaytechPaymentResult {
  success: boolean;
  redirect_url?: string;
  token?: string;
  message?: string;
}

export class PaytechService {
  private apiKey: string;
  private apiSecret: string;
  private baseUrl: string;
  private ipnUrl: string;
  private successUrl: string;
  private cancelUrl: string;

  constructor() {
    this.apiKey = config.PAYTECH_API_KEY;
    this.apiSecret = config.PAYTECH_API_SECRET;
    this.baseUrl = config.PAYTECH_BASE_URL;
    this.ipnUrl = config.PAYTECH_IPN_URL;
    this.successUrl = config.PAYTECH_SUCCESS_URL;
    this.cancelUrl = config.PAYTECH_CANCEL_URL;
  }

  async createPayment(params: PaytechPaymentParams): Promise<PaytechPaymentResult> {
    try {
      const payload = {
        item_name: params.item_name,
        item_price: params.item_price,
        currency: 'XOF',
        ref_command: params.ref_command,
        command_name: params.command_name,
        env: 'prod',
        ipn_url: this.ipnUrl,
        success_url: this.successUrl,
        cancel_url: this.cancelUrl,
        custom_field: JSON.stringify(params.custom_field),
      };
      logger.info('[PAYTECH] Payload:', payload);
      const headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        API_KEY: this.apiKey,
        API_SECRET: this.apiSecret,
      };
      const response = await axios.post(`${this.baseUrl}/payment/request-payment`, payload, { headers });
      logger.info('[PAYTECH] Response:', response.data);
      if (response.data.success && response.data.redirect_url) {
        return {
          success: true,
          redirect_url: response.data.redirect_url,
          token: response.data.token,
        };
      } else {
        return {
          success: false,
          message: response.data.message || 'Erreur PayTech',
        };
      }
    } catch (error: any) {
      logger.error('[PAYTECH] Erreur lors de la création du paiement:', error.response?.data || error.message);
      return {
        success: false,
        message: error.response?.data?.message || error.message || 'Erreur PayTech',
      };
    }
  }
} 