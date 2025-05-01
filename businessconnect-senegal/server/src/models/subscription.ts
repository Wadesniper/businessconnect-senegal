import { Schema, model } from 'mongoose';

export interface ISubscription {
  _id: string;
  userId: string;
  plan: string;
  status: 'pending' | 'active' | 'expired' | 'cancelled';
  paymentId?: string;
  startDate: Date;
  endDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: { type: String, required: true },
  plan: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'active', 'expired', 'cancelled'],
    default: 'pending'
  },
  paymentId: { type: String },
  startDate: { type: Date, default: Date.now },
  endDate: { type: Date, required: true }
}, {
  timestamps: true
});

subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ paymentId: 1 });

export const Subscription = model<ISubscription>('Subscription', subscriptionSchema); 