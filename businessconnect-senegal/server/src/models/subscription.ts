import { Schema, model } from 'mongoose';
import { ISubscription, SubscriptionType, SubscriptionStatus, SubscriptionDocument } from '../types/subscription';

const subscriptionSchema = new Schema<SubscriptionDocument>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: 'User' },
  type: { 
    type: String, 
    enum: ['etudiant', 'annonceur', 'recruteur'] as SubscriptionType[],
    required: true 
  },
  status: { 
    type: String, 
    enum: ['active', 'inactive', 'pending', 'cancelled', 'expired'] as SubscriptionStatus[],
    default: 'pending'
  },
  startDate: { type: Date, required: true },
  endDate: { type: Date, required: true },
  price: { type: Number, required: true },
  currency: { type: String, required: true, default: 'XOF' },
  autoRenew: { type: Boolean, default: true },
  paymentMethod: { type: String },
  lastPaymentDate: { type: Date },
  nextPaymentDate: { type: Date },
  cancelReason: { type: String },
  paymentId: { type: String },
  metadata: { type: Schema.Types.Mixed }
}, {
  timestamps: true
});

// Index pour améliorer les performances des requêtes
subscriptionSchema.index({ userId: 1, status: 1 });
subscriptionSchema.index({ endDate: 1 });

export const Subscription = model<SubscriptionDocument>('Subscription', subscriptionSchema); 