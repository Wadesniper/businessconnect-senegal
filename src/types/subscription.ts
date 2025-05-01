import { Document } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  type: 'basic' | 'premium';
  status: 'active' | 'inactive' | 'expired';
  startDate: Date;
  expiresAt: Date;
  autoRenew: boolean;
  paymentHistory?: Array<{
    amount: number;
    date: Date;
    status: 'success' | 'failed' | 'pending';
    transactionId: string;
  }>;
} 