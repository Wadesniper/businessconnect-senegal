import { message } from 'antd';
import { Subscription } from '../types/user';

interface PayTechConfig {
  apiKey: string;
  apiSecret: string;
  environment: 'test' | 'production';
}

interface PaymentRequest {
  amount: number;
  currency: string;
  description: string;
  customerId: string;
  customerEmail: string;
  customerFullName: string;
  subscriptionType: 'etudiant' | 'annonceur' | 'employeur';
}

// URLs de PayTech configurées
const PAYTECH_URLS = {
  IPN: 'https://businessconnectsenegal.com/api/subscriptions/ipn',
  SUCCESS: 'https://businessconnectsenegal.com/payment/success',
  CANCEL: 'https://businessconnectsenegal.com/payment/cancel'
};

// Configuration PayTech
const PAYTECH_CONFIG = {
  API_KEY: 'be2b2e9b3a0ed01d69d30dff8a21f05199e2e71968788b4890690d7af56ba32b',
  API_SECRET: '6860a504cc73992c2e8dc623c7b31d948ef5a4ec2507a0a4771e62755cca9277',
  ENV: 'prod' as 'test' | 'production'
};

class PaymentService {
  private config: PayTechConfig = {
    apiKey: PAYTECH_CONFIG.API_KEY,
    apiSecret: PAYTECH_CONFIG.API_SECRET,
    environment: PAYTECH_CONFIG.ENV
  };

  private getPayTechUrl(): string {
    return this.config.environment === 'production'
      ? 'https://paytech.sn'
      : 'https://demo.paytech.sn';
  }

  async initiateSubscriptionPayment(request: PaymentRequest): Promise<string> {
    try {
      const payload = {
        item_name: `Abonnement ${request.subscriptionType} BusinessConnect Sénégal`,
        item_price: request.amount,
        currency: request.currency,
        ref_command: `SUB-${Date.now()}-${Math.random().toString(36).substring(7)}`,
        command_name: request.description,
        env: this.config.environment,
        ipn_url: PAYTECH_URLS.IPN,
        success_url: PAYTECH_URLS.SUCCESS,
        cancel_url: PAYTECH_URLS.CANCEL,
        custom_field: JSON.stringify({
          customerId: request.customerId,
          subscriptionType: request.subscriptionType
        })
      };

      const response = await fetch(`${this.getPayTechUrl()}/api/payment/request-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': this.config.apiKey,
          'API-SECRET': this.config.apiSecret
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'initialisation du paiement');
      }

      const data = await response.json();
      if (data.success) {
        return data.redirect_url;
      } else {
        throw new Error(data.message || 'Erreur lors de l\'initialisation du paiement');
      }
    } catch (error) {
      console.error('Erreur PayTech:', error);
      throw new Error('Le service de paiement est temporairement indisponible');
    }
  }

  async verifyPayment(token: string): Promise<boolean> {
    try {
      const response = await fetch(`${this.getPayTechUrl()}/api/payment/check-status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'API-KEY': this.config.apiKey,
          'API-SECRET': this.config.apiSecret
        },
        body: JSON.stringify({ token })
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la vérification du paiement');
      }

      const data = await response.json();
      return data.success && data.status === 'completed';
    } catch (error) {
      console.error('Erreur de vérification PayTech:', error);
      return false;
    }
  }

  getSubscriptionAmount(type: 'etudiant' | 'annonceur' | 'employeur'): number {
    const prices = {
      etudiant: 1000,
      annonceur: 5000,
      employeur: 9000
    };
    return prices[type];
  }
}

export const paymentService = new PaymentService(); 