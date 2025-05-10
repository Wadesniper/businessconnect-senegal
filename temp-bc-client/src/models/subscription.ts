import mongoose, { Document, Schema } from 'mongoose';

export interface ISubscription extends Document {
  userId: string;
  plan: 'basic' | 'premium' | 'recruteur';
  startDate: Date;
  endDate: Date;
  status: 'active' | 'expired' | 'cancelled';
  paymentId: string;
}

const subscriptionSchema = new Schema<ISubscription>({
  userId: {
    type: String,
    required: true,
    ref: 'User'
  },
  plan: {
    type: String,
    required: true,
    enum: ['basic', 'premium', 'recruteur']
  },
  startDate: {
    type: Date,
    required: true,
    default: Date.now
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    required: true,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  paymentId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

export const Subscription = mongoose.model<ISubscription>('Subscription', subscriptionSchema); 