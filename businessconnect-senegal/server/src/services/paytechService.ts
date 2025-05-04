import axios from 'axios';
import crypto from 'crypto';
import { AppError } from '../utils/appError';

interface PayTechConfig {
  apiKey: string;
  webhookSecret: string;
  apiUrl: string;
}

interface PaymentSession {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentUrl: string;
  metadata: Record<string, any>;
}

export class PayTech {
  private apiKey: string;
  private webhookSecret: string;
  private apiUrl: string;

  constructor(apiKey: string, webhookSecret: string, apiUrl: string) {
    this.apiKey = apiKey;
    this.webhookSecret = webhookSecret;
    this.apiUrl = apiUrl;
  }

  private generateSignature(payload: Record<string, any>): string {
    const hmac = crypto.createHmac('sha256', this.webhookSecret);
    hmac.update(JSON.stringify(payload));
    return hmac.digest('hex');
  }

  public verifyWebhookSignature(payload: Record<string, any>, signature: string): boolean {
    const expectedSignature = this.generateSignature(payload);
    return crypto.timingSafeEqual(
      Buffer.from(signature),
      Buffer.from(expectedSignature)
    );
  }

  public async createPaymentSession(params: {
    amount: number;
    description: string;
    customerId: string;
    customerEmail: string;
    metadata?: Record<string, any>;
  }): Promise<PaymentSession> {
    try {
      const response = await axios.post(
        `${this.apiUrl}/payment/init`,
        {
          amount: params.amount,
          description: params.description,
          customer_id: params.customerId,
          customer_email: params.customerEmail,
          metadata: params.metadata
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return {
          id: response.data.payment_id,
          amount: params.amount,
          currency: 'XOF',
          status: 'pending',
          paymentUrl: response.data.payment_url,
          metadata: params.metadata || {}
        };
      }

      throw new AppError('Failed to create payment session', 400);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AppError(
          error.response?.data?.message || 'Payment service error',
          error.response?.status || 500
        );
      }
      throw error;
    }
  }

  public async getPaymentStatus(paymentId: string): Promise<{
    status: string;
    metadata?: Record<string, any>;
  }> {
    try {
      const response = await axios.get(
        `${this.apiUrl}/payment/${paymentId}`,
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        return {
          status: response.data.status,
          metadata: response.data.metadata
        };
      }

      throw new AppError('Failed to get payment status', 400);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        throw new AppError(
          error.response?.data?.message || 'Payment service error',
          error.response?.status || 500
        );
      }
      throw error;
    }
  }
} 