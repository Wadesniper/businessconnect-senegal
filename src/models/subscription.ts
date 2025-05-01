import { Schema, model, Document } from 'mongoose';

export enum SubscriptionStatus {
  PENDING = 'pending',
  ACTIVE = 'active',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled'
}

export enum SubscriptionType {
  BASIC = 'basic',
  PREMIUM = 'premium',
  ENTERPRISE = 'enterprise'
}

export interface ISubscription extends Document {
  userId: string;
  type: SubscriptionType;
  status: SubscriptionStatus;
  startDate: Date;
  endDate: Date;
  paymentId?: string;
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: { type: String, required: true },
  type: { 
    type: String, 
    enum: Object.values(SubscriptionType),
    required: true 
  },
  status: { 
    type: String, 
    enum: Object.values(SubscriptionStatus),
    default: SubscriptionStatus.PENDING 
  },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true },
  paymentId: { type: String },
  amount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'XOF' }
}, {
  timestamps: true
});

// Indexes pour améliorer les performances
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ paymentId: 1 });

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema); 