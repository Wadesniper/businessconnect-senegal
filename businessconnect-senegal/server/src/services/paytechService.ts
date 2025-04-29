import axios from 'axios';
import crypto from 'crypto';
import { logger } from '../utils/logger';

interface PayTechConfig {
  apiKey: string;
  webhookSecret?: string;
  baseUrl?: string;
}

interface SetupIntentParams {
  customer: string;
  payment_method_types: string[];
}

interface PaymentIntentParams {
  amount: number;
  currency: string;
  payment_method: string;
  customer: string;
  metadata?: Record<string, any>;
}

interface SubscriptionParams {
  customer: string;
  plan: string;
  payment_method: string;
}

interface RefundParams {
  payment_intent: string;
  amount: number;
  reason?: string;
}

export class PayTech {
  private readonly apiKey: string;
  private readonly webhookSecret: string;
  private readonly baseUrl: string;

  constructor(apiKey: string, webhookSecret?: string, baseUrl = 'https://api.paytech.sn') {
    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret || '';
    this.baseUrl = baseUrl;
  }

  private async request<T>(method: string, path: string, data?: any): Promise<T> {
    try {
      const response = await axios({
        method,
        url: `${this.baseUrl}${path}`,
        data,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json'
        }
      });

      return response.data;
    } catch (error) {
      logger.error('PayTech API error:', error);
      throw error;
    }
  }

  async createSetupIntent(params: SetupIntentParams) {
    return this.request<any>('POST', '/v1/setup_intents', params);
  }

  async createPaymentIntent(params: PaymentIntentParams) {
    return this.request<any>('POST', '/v1/payment_intents', params);
  }

  async createSubscription(params: SubscriptionParams) {
    return this.request<any>('POST', '/v1/subscriptions', params);
  }

  async cancelSubscription(subscriptionId: string) {
    return this.request<any>('DELETE', `/v1/subscriptions/${subscriptionId}`);
  }

  async createRefund(params: RefundParams) {
    return this.request<any>('POST', '/v1/refunds', params);
  }

  constructEvent(payload: any, signature: string) {
    if (!signature) {
      throw new Error('Aucune signature fournie');
    }

    if (!this.webhookSecret) {
      throw new Error('Clé secrète webhook non configurée');
    }

    try {
      // Extraire les composants de la signature
      const [timestamp, signatureHash] = signature.split(',');
      const timestampValue = timestamp.split('=')[1];
      const signatureValue = signatureHash.split('=')[1];

      // Vérifier que le timestamp n'est pas trop ancien (tolérance de 5 minutes)
      const eventAge = Math.floor(Date.now() / 1000) - parseInt(timestampValue);
      if (eventAge > 300) {
        throw new Error('Webhook trop ancien');
      }

      // Recréer la chaîne signée
      const payloadString = JSON.stringify(payload);
      const signedPayload = `${timestampValue}.${payloadString}`;

      // Calculer le HMAC
      const expectedSignature = crypto
        .createHmac('sha256', this.webhookSecret)
        .update(signedPayload)
        .digest('hex');

      // Vérifier la signature
      if (expectedSignature !== signatureValue) {
        throw new Error('Signature invalide');
      }

      return payload;
    } catch (error) {
      logger.error('Erreur de vérification de la signature webhook:', error);
      throw new Error('Erreur de vérification de la signature webhook');
    }
  }
} 