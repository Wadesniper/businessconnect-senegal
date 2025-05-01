import axios from 'axios';
import { config } from '../config';

export class PaymentService {
  private readonly apiKey: string;
  private readonly secretKey: string;
  private readonly baseUrl: string = 'https://paytech.sn/api';

  constructor() {
    this.apiKey = process.env.PAYTECH_API_KEY || '';
    this.secretKey = process.env.PAYTECH_SECRET_KEY || '';
  }

  async createPayment(data: {
    amount: number;
    customerId: string;
    subscriptionPlan: string;
  }) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/payment/request`,
        {
          amount: data.amount,
          item_name: `Abonnement ${data.subscriptionPlan}`,
          currency: 'XOF',
          ref_command: `SUB-${Date.now()}-${data.customerId}`,
          success_url: `${process.env.FRONTEND_URL}/subscription/success`,
          cancel_url: `${process.env.FRONTEND_URL}/subscription/cancel`,
          ipn_url: `${process.env.FRONTEND_URL}/api/webhook/payment`,
        },
        {
          headers: {
            'X-API-KEY': this.apiKey,
            'X-SECRET-KEY': this.secretKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la création du paiement');
    }
  }

  async verifyPayment(paymentId: string) {
    try {
      const response = await axios.get(
        `${this.baseUrl}/payment/check/${paymentId}`,
        {
          headers: {
            'X-API-KEY': this.apiKey,
            'X-SECRET-KEY': this.secretKey,
          },
        }
      );

      return response.data;
    } catch (error) {
      throw new Error('Erreur lors de la vérification du paiement');
    }
  }
} 