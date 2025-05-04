import { Schema } from 'mongoose';

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded';
export type PaymentCurrency = 'XOF' | 'EUR' | 'USD';
export type PaymentMethod = 'card' | 'mobile_money' | 'bank_transfer' | 'cash';

export interface IPayment {
  _id: string;
  amount: number;
  currency: PaymentCurrency;
  status: PaymentStatus;
  paymentMethod: PaymentMethod;
  paymentId: string;
  transactionId?: string;
  user: Schema.Types.ObjectId;
  description: string;
  metadata?: Record<string, any>;
  errorMessage?: string;
  refundReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentCreateData {
  amount: number;
  currency: PaymentCurrency;
  description: string;
  userId: string;
  paymentMethod: PaymentMethod;
  metadata?: Record<string, any>;
}

export interface PaymentGatewayConfig {
  apiKey: string;
  apiSecret?: string;
  webhookSecret: string;
  baseUrl: string;
  environment: 'development' | 'production';
}

export interface PaymentGatewayResponse {
  success: boolean;
  paymentId: string;
  transactionId?: string;
  error?: string;
  redirectUrl?: string;
}

export interface PaymentInitiationResponse {
  success: boolean;
  data: {
    paymentId: string;
    amount: number;
    currency: PaymentCurrency;
    status: PaymentStatus;
    redirectUrl?: string;
  };
}

export interface PaymentConfirmationData {
  paymentId: string;
  transactionId: string;
  status: PaymentStatus;
  metadata?: Record<string, any>;
}

export interface PaymentRefundData {
  paymentId: string;
  reason: string;
  amount?: number;
  metadata?: Record<string, any>;
}

export interface PaymentWebhookData {
  event: string;
  paymentId: string;
  transactionId?: string;
  status: PaymentStatus;
  metadata?: Record<string, any>;
  error?: {
    code: string;
    message: string;
  };
}

export interface PaymentStats {
  totalAmount: number;
  totalCount: number;
  successfulAmount: number;
  successfulCount: number;
  failedAmount: number;
  failedCount: number;
  refundedAmount: number;
  refundedCount: number;
  currency: PaymentCurrency;
  periodStart: Date;
  periodEnd: Date;
}

export interface SubscriptionWebhookData {
  id: string;
  customer: string;
  plan: {
    id: string;
    name: string;
    amount: number;
    currency: string;
    interval: 'month' | 'year';
  };
  status: 'active' | 'canceled' | 'past_due' | 'unpaid';
  current_period_start: string;
  current_period_end: string;
  canceled_at?: string;
  metadata: Record<string, any>;
}

export interface InvoiceWebhookData {
  id: string;
  customer: string;
  subscription?: string;
  amount: number;
  currency: string;
  status: 'draft' | 'open' | 'paid' | 'uncollectible' | 'void';
  payment_intent?: string;
  created_at: string;
  due_date: string;
  lines: Array<{
    description: string;
    amount: number;
    quantity: number;
  }>;
  metadata: Record<string, any>;
}

export interface WebhookEvent {
  id: string;
  type: string;
  created_at: string;
  data: PaymentWebhookData | SubscriptionWebhookData | InvoiceWebhookData;
} 