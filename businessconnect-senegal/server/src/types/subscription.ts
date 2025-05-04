import { Schema, Document, Types } from 'mongoose';
import { PaymentMethod } from './payment';
import { BaseDocument } from './global';

export type SubscriptionType = 'etudiant' | 'annonceur' | 'recruteur';
export type SubscriptionStatus = 'pending' | 'active' | 'cancelled' | 'expired' | 'inactive';
export type SubscriptionInterval = 'month' | 'year';

export interface ISubscription {
  userId: Types.ObjectId;
  type: SubscriptionType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  price: number;
  currency: string;
  autoRenew: boolean;
  paymentMethod?: PaymentMethod;
  lastPaymentDate?: Date;
  nextPaymentDate?: Date;
  cancelReason?: string;
  paymentId?: string;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

export interface SubscriptionDocument extends Document, ISubscription {
  _id: Types.ObjectId;
  save(): Promise<this>;
  toObject(): ISubscription;
}

export interface SubscriptionPlan {
  id: string;
  name: string;
  type: SubscriptionType;
  price: number;
  interval: SubscriptionInterval;
  features: string[];
  description?: string;
  trialDays?: number;
}

export interface SubscriptionCreateInput {
  userId: string;
  type: SubscriptionType;
  paymentMethod?: PaymentMethod;
}

export interface SubscriptionRenewalData {
  subscriptionId: string;
  paymentMethod: PaymentMethod;
  metadata?: Record<string, any>;
}

export interface SubscriptionCancelData {
  subscriptionId: string;
  reason?: string;
  endImmediately?: boolean;
}

export interface SubscriptionUpdateData {
  type?: SubscriptionType;
  autoRenew?: boolean;
  features?: string[];
  metadata?: Record<string, any>;
}

export interface SubscriptionWebhookData {
  event: string;
  subscriptionId: string;
  userId: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  startDate: string;
  endDate: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionStats {
  totalActive: number;
  totalRevenue: number;
  byType: Record<SubscriptionType, number>;
  byStatus: Record<SubscriptionStatus, number>;
  revenueByMonth: Array<{
    month: string;
    revenue: number;
    count: number;
  }>;
}

export interface SubscriptionFilters {
  type?: SubscriptionType;
  status?: SubscriptionStatus;
  startDate?: Date;
  endDate?: Date;
  autoRenew?: boolean;
}

export interface SubscriptionRequest {
  type: SubscriptionType;
  autoRenew?: boolean;
}

export interface SubscriptionResponse {
  id: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  price: number;
  currency: string;
  autoRenew: boolean;
}

export interface PaymentGatewayConfig {
  apiKey: string;
  apiSecret: string;
  webhookSecret: string;
  baseUrl: string;
  environment: 'development' | 'production';
}

export interface PaymentInitiation {
  amount: number;
  currency: string;
  description: string;
  customerId: string;
  metadata?: Record<string, any>;
}

export interface PayTechCallbackData {
  type: string;
  data: {
    id: string;
    status: string;
    amount: number;
    currency: string;
    customerId: string;
    metadata?: Record<string, any>;
    createdAt: string;
  };
}

export interface SubscriptionPricing {
  basic: number;
  premium: number;
  enterprise: number;
}

export interface PaymentData {
  amount: number;
  description: string;
  customField: string;
  item_name: string;
  item_price: number;
  currency: string;
  ref_command: string;
  command_name: string;
}

export interface PaymentSession {
  id: string;
  amount: number;
  currency: string;
  status: string;
  paymentUrl: string;
  metadata: {
    userId: string;
    subscriptionType: SubscriptionType;
    duration: number;
  };
}

export interface SubscriptionUpdateInput {
  status?: SubscriptionStatus;
  endDate?: Date;
  autoRenew?: boolean;
  paymentMethod?: PaymentMethod;
  cancelReason?: string;
  metadata?: Record<string, any>;
}

export interface SubscriptionFilter {
  userId?: string;
  type?: SubscriptionType;
  status?: SubscriptionStatus;
  startDate?: { $gte?: Date; $lte?: Date };
  endDate?: { $gte?: Date; $lte?: Date };
}

export interface PaymentWebhookData {
  type: string;
  data: {
    id: string;
    status: 'completed' | 'failed' | 'pending';
    amount: number;
    currency: string;
    customerId: string;
    metadata?: Record<string, any>;
    createdAt: string;
  };
} 