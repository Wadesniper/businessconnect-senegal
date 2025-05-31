export interface PaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: 'pending' | 'completed' | 'failed';
  payment_method: string;
  metadata: Record<string, any>;
  created_at: Date;
}

export interface PaymentWebhookData {
  id: string;
  type: string;
  amount: number;
  currency: string;
  status: string;
  payment_method: string;
  customer: string;
  metadata: {
    order_id?: string;
    [key: string]: any;
  };
  created_at: string;
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